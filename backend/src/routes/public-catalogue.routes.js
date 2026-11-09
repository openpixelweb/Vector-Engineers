const router = require('express').Router();
const mongoose = require('mongoose');
const { Brand, ProductGroup, Product, ProductModel, Industry, Application } = require('../models/catalog.models');
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const paginate = q => ({ page: Math.max(1, Math.min(100000, parseInt(q.page, 10) || 1)), limit: Math.max(1, Math.min(24, parseInt(q.limit, 10) || 9)) });
const error = (res, message, status = 404) => res.status(status).json({ success: false, message });
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function availableParents() {
  const brands = await Brand.find({ status: 'published' }).select('_id name slug logoUrl').lean();
  const brandIds = brands.map(b => b._id);
  const groups = await ProductGroup.find({ status: 'published', brandId: { $in: brandIds } }).select('_id name slug brandId').lean();
  return { brands, groups, brandById: new Map(brands.map(b => [String(b._id), b])), groupById: new Map(groups.map(g => [String(g._id), g])) };
}

function decorate(product, parents) {
  const b = parents.brandById.get(String(product.brandId));
  const g = parents.groupById.get(String(product.groupId));
  if (!b || !g || String(g.brandId) !== String(b._id)) return null;
  return { ...product, brand: { _id: b._id, name: b.name, slug: b.slug, logoUrl: b.logoUrl }, group: { _id: g._id, name: g.name, slug: g.slug } };
}

// Public products, with published brand/group and optional industry filter.
// Industry filtering checks both inherited and model-specific industry associations.
router.get('/products', wrap(async (req, res) => {
  const { page, limit } = paginate(req.query);
  const parents = await availableParents();
  let brands = parents.brands;
  if (req.query.brand) brands = brands.filter(b => b.slug === req.query.brand);
  let groups = parents.groups.filter(g => brands.some(b => String(b._id) === String(g.brandId)));
  if (req.query.group) groups = groups.filter(g => g.slug === req.query.group);
  const filter = { status: 'published', brandId: { $in: brands.map(b => b._id) }, groupId: { $in: groups.map(g => g._id) } };
  const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 80) : '';
  if (q) filter.name = { $regex: esc(q), $options: 'i' };
  if (req.query.industry) {
    const industry = await Industry.findOne({ slug: req.query.industry, status: 'published' }).select('_id').lean();
    if (!industry) return res.json({ success: true, data: [], pagination: { page, limit, total: 0, pages: 0 } });
    // Models with overrides may narrow or extend the applicable industries.
    // If published models exist, applicability is determined by those models.
    // Without published models, the product-level industry list is used.
    const ids = await Product.find(filter).select('_id industryIds').lean();
    const models = await ProductModel.find({ productId: { $in: ids.map(p => p._id) }, status: 'published' }).select('productId industryOverrideIds').lean();
    const byProduct = new Map();
    for (const m of models) {
      const k = String(m.productId);
      if (!byProduct.has(k)) byProduct.set(k, []);
      byProduct.get(k).push(m);
    }
    const matches = ids.filter(p => {
      const own = p.industryIds || [];
      const modelList = byProduct.get(String(p._id)) || [];
      return modelList.length ? modelList.some(m => (m.industryOverrideIds == null ? own : m.industryOverrideIds).some(id => String(id) === String(industry._id))) : own.some(id => String(id) === String(industry._id));
    });
    filter._id = { $in: matches.map(p => p._id) };
  }
  
const sortOptions = {
  featured: { sortOrder: 1, name: 1, _id: 1 },
  name_asc: { name: 1, _id: 1 },
  name_desc: { name: -1, _id: 1 },
  newest: { createdAt: -1, _id: -1 }
};

const selectedSort = sortOptions[req.query.sort]
  ? req.query.sort
  : "featured";

const sortBy = sortOptions[selectedSort];

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortBy).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter)
  ]);
  res.json({ success: true, data: items.map(p => decorate(p, parents)).filter(Boolean), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}));

router.get('/products/:id', wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return error(res, 'Invalid product ID', 400);
  const product = await Product.findOne({ _id: req.params.id, status: 'published' }).lean();
  if (!product) return error(res, 'Product not found');
  const parents = await availableParents();
  const data = decorate(product, parents);
  if (!data) return error(res, 'Product not found');
  res.json({ success: true, data });
}));

router.get('/models/:id', wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return error(res, 'Invalid model ID', 400);
  const model = await ProductModel.findOne({ _id: req.params.id, status: 'published' }).lean();
  if (!model) return error(res, 'Model not found');
  const product = await Product.findOne({ _id: model.productId, status: 'published' }).lean();
  if (!product) return error(res, 'Model not found');
  const parents = await availableParents();
  const decorated = decorate(product, parents);
  if (!decorated) return error(res, 'Model not found');
  const industryIds = model.industryOverrideIds == null ? product.industryIds : model.industryOverrideIds;
  const applicationIds = model.applicationOverrideIds == null ? product.applicationIds : model.applicationOverrideIds;
  const [industries, applications] = await Promise.all([
    Industry.find({ _id: { $in: industryIds || [] }, status: 'published' }).select('name slug').lean(),
    Application.find({ _id: { $in: applicationIds || [] }, status: 'published' }).select('name slug').lean()
  ]);
  res.json({ success: true, data: { ...model, product: decorated, industries, applications } });
}));



/*
  PHASE 8: Industry and Application product listings
*/

async function getMappedProducts(req, res, type) {
  const { page, limit } = paginate(req.query);
  const slug = String(req.params.slug || "").trim();

  const isIndustry = type === "industry";
  const CategoryModel = isIndustry ? Industry : Application;
  const productField = isIndustry ? "industryIds" : "applicationIds";
  const overrideField = isIndustry
    ? "industryOverrideIds"
    : "applicationOverrideIds";

  const category = await CategoryModel.findOne({
    slug,
    status: "published"
  }).lean();

  if (!category) {
    return res.status(404).json({
      success: false,
      message: `${isIndustry ? "Industry" : "Application"} not found`
    });
  }

  const parents = await availableParents();

  // Include only products belonging to published
  // brands and published product groups.
  const products = await Product.find({
    status: "published",
    brandId: { $in: parents.brands.map(b => b._id) },
    groupId: { $in: parents.groups.map(g => g._id) }
  })
    .sort({ sortOrder: 1, name: 1, _id: 1 })
    .lean();

  const validProducts = products
    .map(product => decorate(product, parents))
    .filter(Boolean);

  const models = await ProductModel.find({
    status: "published",
    productId: { $in: validProducts.map(p => p._id) }
  })
    .select(`productId ${overrideField}`)
    .lean();

  const modelsByProduct = new Map();

  for (const model of models) {
    const id = String(model.productId);

    if (!modelsByProduct.has(id)) {
      modelsByProduct.set(id, []);
    }

    modelsByProduct.get(id).push(model);
  }

  const matchingProducts = validProducts.filter(product => {
    const productAssignments = product[productField] || [];
    const productModels =
      modelsByProduct.get(String(product._id)) || [];

    const matchesCategory = ids =>
      (ids || []).some(id =>
        String(id) === String(category._id)
      );

    // No published models: use product assignments.
    if (productModels.length === 0) {
      return matchesCategory(productAssignments);
    }

    // Published models inherit product assignments,
    // unless model-specific overrides exist.
    return productModels.some(model => {
      const assignedIds =
        model[overrideField] == null
          ? productAssignments
          : model[overrideField];

      return matchesCategory(assignedIds);
    });
  });

  const total = matchingProducts.length;
  const start = (page - 1) * limit;

  res.json({
    success: true,
    category: {
      _id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description
    },
    data: matchingProducts.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}

router.get(
  "/industries/:slug/products",
  wrap((req, res) => getMappedProducts(req, res, "industry"))
);

router.get(
  "/applications/:slug/products",
  wrap((req, res) => getMappedProducts(req, res, "application"))
);


module.exports = router;
