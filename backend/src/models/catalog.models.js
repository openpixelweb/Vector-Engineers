const mongoose = require('mongoose');
const { Schema } = mongoose;
const status = { type: String, enum: ['draft', 'published', 'inactive'], default: 'draft', index: true };
const slug = { type: String, required: true, lowercase: true, trim: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ };
const optText = { type: String, trim: true, default: '' };
const photo = new Schema({ url: { type: String, required: true, trim: true }, alt: optText, sortOrder: { type: Number, default: 0 } }, { _id: false });
const spec = new Schema({ name: { type: String, required: true, trim: true }, value: { type: String, required: true, trim: true }, unit: optText }, { _id: false });
const opts = { timestamps: true };

const brandSchema = new Schema({ name: { type: String, required: true, trim: true }, slug, description: optText, logoUrl: optText, website: optText, sortOrder: { type: Number, default: 0 }, status }, opts);
brandSchema.index({ slug: 1 }, { unique: true });

const groupSchema = new Schema({ brandId: { type: Schema.Types.ObjectId, ref: 'Brand', required: true, index: true }, name: { type: String, required: true, trim: true }, slug, description: optText, imageUrl: optText, sortOrder: { type: Number, default: 0 }, status }, opts);
groupSchema.index({ brandId: 1, slug: 1 }, { unique: true });

const industrySchema = new Schema({ name: { type: String, required: true, trim: true }, slug, description: optText, imageUrl: optText, sortOrder: { type: Number, default: 0 }, status }, opts);
industrySchema.index({ slug: 1 }, { unique: true });
const applicationSchema = new Schema({ name: { type: String, required: true, trim: true }, slug, description: optText, imageUrl: optText, sortOrder: { type: Number, default: 0 }, status }, opts);
applicationSchema.index({ slug: 1 }, { unique: true });

const productSchema = new Schema({ brandId: { type: Schema.Types.ObjectId, ref: 'Brand', required: true, index: true }, groupId: { type: Schema.Types.ObjectId, ref: 'ProductGroup', required: true, index: true }, name: { type: String, required: true, trim: true }, slug, description: optText, imageUrl: optText, industryIds: [{ type: Schema.Types.ObjectId, ref: 'Industry' }], applicationIds: [{ type: Schema.Types.ObjectId, ref: 'Application' }], sortOrder: { type: Number, default: 0 }, status }, opts);
productSchema.index({ groupId: 1, slug: 1 }, { unique: true });

const modelSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true }, modelName: { type: String, required: true, trim: true }, manufacturerModelNumber: { type: String, required: true, trim: true }, slug, description: optText, images: [photo], specifications: [spec], brochureUrls: [{ type: String, trim: true }], industryOverrideIds: { type: [{ type: Schema.Types.ObjectId, ref: 'Industry' }], default: undefined }, applicationOverrideIds: { type: [{ type: Schema.Types.ObjectId, ref: 'Application' }], default: undefined }, status }, opts);
modelSchema.index({ productId: 1, slug: 1 }, { unique: true });
modelSchema.index({ productId: 1, manufacturerModelNumber: 1 }, { unique: true });

module.exports = {
  Brand: mongoose.models.Brand || mongoose.model('Brand', brandSchema),
  ProductGroup: mongoose.models.ProductGroup || mongoose.model('ProductGroup', groupSchema),
  Product: mongoose.models.Product || mongoose.model('Product', productSchema),
  ProductModel: mongoose.models.ProductModel || mongoose.model('ProductModel', modelSchema),
  Industry: mongoose.models.Industry || mongoose.model('Industry', industrySchema),
  Application: mongoose.models.Application || mongoose.model('Application', applicationSchema)
};
