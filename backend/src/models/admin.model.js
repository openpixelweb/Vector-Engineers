const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  displayName: { type: String, required: true, trim: true },
  role: { type: String, enum: ['super_admin', 'admin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null }
}, { timestamps: true });
module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
