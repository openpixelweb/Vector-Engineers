const router = require('express').Router();
const mongoose = require('mongoose');
const { Brand, ProductGroup, Product, ProductModel, Industry, Application } = require('../models/catalog.models');

const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const goodId = x => mongoose.isValidObjectId(x);
const paging = query => ({
  page: Math.max(1, Math.min(100000, parseInt(query.page, 10) || 1)),
  limit: Math.max(1, Math.min(50, parseInt(query.limit, 10) || 12))
});
const jsonList = (res, data, total, page, limit) => res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
const list = (Model, makeFilter = () => ({})) => asyncRoute(async (req, res) => {
  const { page, limit } = paging(req.query);
  const filter = { status: 'published', ...(await makeFilter(req, res)) };
  if (res.headersSent) return;
  const [data, total] = await Promise.all([
    Model.find(filter).sort({ sortOrder: 1, name: 1, modelName: 1, _id: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Model.countDocuments(filter)
  ]);
  jsonList(res, data, total, page, limit);
});

router.get('/brands', list(Brand));
router.get('/industries', list(Industry));
router.get('/applications', list(Application));

router.get('/brands/:slug/groups', asyncRoute(async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug, status: 'published' }).lean();
  if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
  const { page, limit } = paging(req.query);
  const filter = { brandId: brand._id, status: 'published' };
  const [data, total] = await Promise.all([
    ProductGroup.find(filter).sort({ sortOrder: 1, name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    ProductGroup.countDocuments(filter)
  ]);
  jsonList(res, data, total, page, limit);
}));

// Published products must have published brand and group. A model can narrow its
// industry/application assignments; the industry filtering API will be implemented in Phase 5.
router.get('/products', asyncRoute(async (req, res) => {
  const { page, limit } = paging(req.query);
  const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 80) : '';
  const filter = { status: 'published' };
  if (q) filter.name = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  if (req.query.brand) {
    const brand = await Brand.findOne({ slug: req.query.brand, status: 'published' }).select('_id').lean();
    if (!brand) return jsonList(res, [], 0, page, limit);
    filter.brandId = brand._id;
  }
  if (req.query.group) {
    const groups = await ProductGroup.find({ slug: req.query.group, status: 'published', ...(filter.brandId ? { brandId: filter.brandId } : {}) }).select('_id').lean();
    filter.groupId = { $in: groups.map(g => g._id) };
  }
  const [brands, groups] = await Promise.all([
    Brand.find({ status: 'published' }).select('_id').lean(),
    ProductGroup.find({ status: 'published' }).select('_id').lean()
  ]);
  filter.brandId = filter.brandId || { $in: brands.map(b => b._id) };
  filter.groupId = filter.groupId || { $in: groups.map(g => g._id) };
  const [data, total] = await Promise.all([
    Product.find(filter).sort({ sortOrder: 1, name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter)
  ]);
  jsonList(res, data, total, page, limit);
}));

router.get('/products/:id/models', asyncRoute(async (req, res) => {
  if (!goodId(req.params.id)) return res.status(400).json({ success: false, message: 'Valid product ID required' });
  const product = await Product.findOne({ _id: req.params.id, status: 'published' }).lean();
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const [brand, group] = await Promise.all([
    Brand.exists({ _id: product.brandId, status: 'published' }),
    ProductGroup.exists({ _id: product.groupId, status: 'published' })
  ]);
  if (!brand || !group) return res.status(404).json({ success: false, message: 'Product not found' });
  const { page, limit } = paging(req.query);
  const filter = { productId: product._id, status: 'published' };
  const [data, total] = await Promise.all([
    ProductModel.find(filter).sort({ modelName: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    ProductModel.countDocuments(filter)
  ]);
  const models = data.map(model => ({
    ...model,
    effectiveIndustryIds: model.industryOverrideIds == null ? product.industryIds : model.industryOverrideIds,
    effectiveApplicationIds: model.applicationOverrideIds == null ? product.applicationIds : model.applicationOverrideIds
  }));
  jsonList(res, models, total, page, limit);
}));

router.get('/models/:id', asyncRoute(async (req, res) => {
  if (!goodId(req.params.id)) return res.status(400).json({ success: false, message: 'Valid model ID required' });
  const model = await ProductModel.findOne({ _id: req.params.id, status: 'published' }).lean();
  if (!model) return res.status(404).json({ success: false, message: 'Model not found' });
  const product = await Product.findOne({ _id: model.productId, status: 'published' }).lean();
  if (!product) return res.status(404).json({ success: false, message: 'Model not found' });
  const [brand, group] = await Promise.all([
    Brand.exists({ _id: product.brandId, status: 'published' }),
    ProductGroup.exists({ _id: product.groupId, status: 'published' })
  ]);
  if (!brand || !group) return res.status(404).json({ success: false, message: 'Model not found' });
  res.json({ success: true, data: {
    ...model,
    effectiveIndustryIds: model.industryOverrideIds == null ? product.industryIds : model.industryOverrideIds,
    effectiveApplicationIds: model.applicationOverrideIds == null ? product.applicationIds : model.applicationOverrideIds,
    product: { _id: product._id, name: product.name, slug: product.slug }
  }});
}));

module.exports = router;
