const mongoose = require('mongoose');
const { Brand, ProductGroup, Product, ProductModel, Industry, Application } = require('../models/catalog.models');

const config = {
  brands: { Model: Brand, fields: ['name', 'slug', 'description', 'logoUrl', 'website', 'sortOrder', 'status'], required: ['name', 'slug'] },
  groups: { Model: ProductGroup, fields: ['brandId', 'name', 'slug', 'description', 'imageUrl', 'sortOrder', 'status'], required: ['brandId', 'name', 'slug'], parent: 'brandId' },
  products: { Model: Product, fields: ['brandId', 'groupId', 'name', 'slug', 'description', 'imageUrl', 'industryIds', 'applicationIds', 'sortOrder', 'status'], required: ['brandId', 'groupId', 'name', 'slug'], parent: 'groupId' },
  models: { Model: ProductModel, fields: ['productId', 'modelName', 'manufacturerModelNumber', 'slug', 'description', 'images', 'specifications', 'brochureUrls', 'industryOverrideIds', 'applicationOverrideIds', 'status'], required: ['productId', 'modelName', 'manufacturerModelNumber', 'slug'], parent: 'productId' },
  industries: { Model: Industry, fields: ['name', 'slug', 'description', 'imageUrl', 'sortOrder', 'status'], required: ['name', 'slug'] },
  applications: { Model: Application, fields: ['name', 'slug', 'description', 'imageUrl', 'sortOrder', 'status'], required: ['name', 'slug'] }
};
const allowedStates = new Set(['draft', 'published', 'inactive']);
const fail = (status, message) => Object.assign(new Error(message), { httpStatus: status });
const goodId = x => mongoose.isValidObjectId(x);

function cleanBody(body, item, isCreate) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw fail(400, 'JSON object required');
  const extra = Object.keys(body).filter(k => !item.fields.includes(k));
  if (extra.length) throw fail(400, `Unsupported field(s): ${extra.join(', ')}`);
  const cleaned = { ...body };
  if (isCreate) {
    const missing = item.required.filter(k => cleaned[k] == null || cleaned[k] === '');
    if (missing.length) throw fail(400, `Missing required field(s): ${missing.join(', ')}`);
  }
  if ('status' in cleaned && !allowedStates.has(cleaned.status)) throw fail(400, 'status must be draft, published or inactive');
  if ('slug' in cleaned && (typeof cleaned.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleaned.slug))) throw fail(400, 'slug must use lowercase letters, numbers and hyphens');
  for (const k of ['name', 'modelName', 'manufacturerModelNumber']) {
    if (k in cleaned && (typeof cleaned[k] !== 'string' || !cleaned[k].trim())) throw fail(400, `${k} must be a non-empty string`);
  }
  for (const k of ['brandId', 'groupId', 'productId']) {
    if (k in cleaned && !goodId(cleaned[k])) throw fail(400, `${k} must be a valid MongoDB ID`);
  }
  for (const k of ['industryIds', 'applicationIds', 'industryOverrideIds', 'applicationOverrideIds']) {
    if (!(k in cleaned)) continue;
    // null explicitly resets model overrides to inherit from the parent product.
    if (cleaned[k] === null && (k === 'industryOverrideIds' || k === 'applicationOverrideIds')) continue;
    if (!Array.isArray(cleaned[k]) || cleaned[k].length > 100 || cleaned[k].some(x => !goodId(x))) throw fail(400, `${k} must be an array of valid IDs (maximum 100)`);
    if (new Set(cleaned[k].map(String)).size !== cleaned[k].length) throw fail(400, `${k} contains duplicate IDs`);
  }
  if ('images' in cleaned && (!Array.isArray(cleaned.images) || cleaned.images.length > 25)) throw fail(400, 'images must be an array (maximum 25)');
  if ('specifications' in cleaned && (!Array.isArray(cleaned.specifications) || cleaned.specifications.length > 80)) throw fail(400, 'specifications must be an array (maximum 80)');
  if ('brochureUrls' in cleaned && (!Array.isArray(cleaned.brochureUrls) || cleaned.brochureUrls.length > 25)) throw fail(400, 'brochureUrls must be an array (maximum 25)');
  return cleaned;
}

async function checkReferences(resource, data) {
  const checkOne = async (Model, id, label) => {
    if (id && !await Model.exists({ _id: id, status: { $ne: 'inactive' } })) throw fail(400, `${label} does not exist or is inactive`);
  };
  if (resource === 'groups') await checkOne(Brand, data.brandId, 'brandId');
  if (resource === 'products') {
    await checkOne(Brand, data.brandId, 'brandId');
    if (data.groupId) {
      const group = await ProductGroup.findById(data.groupId).lean();
      if (!group || group.status === 'inactive') throw fail(400, 'groupId does not exist or is inactive');
      if (String(group.brandId) !== String(data.brandId)) throw fail(400, 'groupId must belong to the selected brandId');
    }
  }
  if (resource === 'models') await checkOne(Product, data.productId, 'productId');
  for (const [key, Model] of [ ['industryIds', Industry], ['industryOverrideIds', Industry], ['applicationIds', Application], ['applicationOverrideIds', Application] ]) {
    if (!Array.isArray(data[key]) || !data[key].length) continue;
    const count = await Model.countDocuments({ _id: { $in: data[key] }, status: { $ne: 'inactive' } });
    if (count !== data[key].length) throw fail(400, `${key} contains missing or inactive references`);
  }
}

function handleError(error, res, next) {
  if (error.httpStatus) return res.status(error.httpStatus).json({ success: false, message: error.message });
  if (error.code === 11000) return res.status(409).json({ success: false, message: 'A record with this slug or model number already exists in this scope' });
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ success: false, message: error.message });
  next(error);
}
module.exports = { config, cleanBody, checkReferences, handleError, fail, goodId };
