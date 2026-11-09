const router = require('express').Router();
const { requireAdmin, requireSuperAdmin } = require('../middleware/require-admin');
const { config, cleanBody, checkReferences, handleError, fail, goodId } = require('../utils/admin-catalog-utils');

// Every operation here requires a valid token and the super_admin role.
router.use(requireAdmin, requireSuperAdmin);
const wrap = fn => async (req, res, next) => { try { await fn(req, res); } catch (error) { handleError(error, res, next); } };

function resourceFrom(req) {
  const resource = req.params.resource;
  if (!Object.prototype.hasOwnProperty.call(config, resource)) throw fail(404, 'Unknown catalogue resource');
  return { resource, ...config[resource] };
}

router.get('/:resource', wrap(async (req, res) => {
  const { Model } = resourceFrom(req);
  const page = Math.max(1, Math.min(100000, parseInt(req.query.page, 10) || 1));
  const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 12));
  const filter = {};
  if (req.query.status) {
    if (!['draft', 'published', 'inactive'].includes(req.query.status)) throw fail(400, 'Invalid status filter');
    filter.status = req.query.status;
  }
  for (const key of ['brandId', 'groupId', 'productId']) {
    if (key in Model.schema.paths && req.query[key]) {
      if (!goodId(req.query[key])) throw fail(400, `Invalid ${key}`);
      filter[key] = req.query[key];
    }
  }
  const [data, total] = await Promise.all([
    Model.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Model.countDocuments(filter)
  ]);
  res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}));

router.get('/:resource/:id', wrap(async (req, res) => {
  const { Model } = resourceFrom(req);
  if (!goodId(req.params.id)) throw fail(400, 'Valid record ID required');
  const data = await Model.findById(req.params.id).lean();
  if (!data) throw fail(404, 'Record not found');
  res.json({ success: true, data });
}));

router.post('/:resource', wrap(async (req, res) => {
  const { resource, Model, ...item } = resourceFrom(req);
  const data = cleanBody(req.body, item, true);
  await checkReferences(resource, data);
  const created = await Model.create(data);
  res.status(201).json({ success: true, message: 'Created successfully', data: created });
}));

router.patch('/:resource/:id', wrap(async (req, res) => {
  const { resource, Model, ...item } = resourceFrom(req);
  if (!goodId(req.params.id)) throw fail(400, 'Valid record ID required');
  const existing = await Model.findById(req.params.id);
  if (!existing) throw fail(404, 'Record not found');
  const updates = cleanBody(req.body, item, false);
  if (Object.keys(updates).length === 0) throw fail(400, 'Provide at least one field to update');
  // Protect catalogue hierarchy against accidental reparenting.
  for (const key of ['brandId', 'groupId', 'productId']) {
    if (key in updates && String(updates[key]) !== String(existing[key])) throw fail(400, `Changing ${key} is not supported. Create a new record in the correct parent.`);
  }
  const merged = { ...existing.toObject(), ...updates };
  await checkReferences(resource, merged);
  if (updates.industryOverrideIds === null) delete updates.industryOverrideIds;
  if (updates.applicationOverrideIds === null) delete updates.applicationOverrideIds;
  const clearIndustry = req.body.industryOverrideIds === null;
  const clearApplication = req.body.applicationOverrideIds === null;
  for (const [key, value] of Object.entries(updates)) existing.set(key, value);
  if (clearIndustry) existing.set('industryOverrideIds', undefined);
  if (clearApplication) existing.set('applicationOverrideIds', undefined);
  await existing.save();
  res.json({ success: true, message: 'Updated successfully', data: existing });
}));

// Soft-deactivate only. No hard-delete endpoint is provided.
router.delete('/:resource/:id', wrap(async (req, res) => {
  const { Model } = resourceFrom(req);
  if (!goodId(req.params.id)) throw fail(400, 'Valid record ID required');
  const record = await Model.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true, runValidators: true });
  if (!record) throw fail(404, 'Record not found');
  res.json({ success: true, message: 'Record deactivated (not permanently deleted)', data: record });
}));

module.exports = router;
