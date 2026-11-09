const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

async function requireAdmin(req, res, next) {
  try {
    const header = req.get('Authorization') || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Authentication required' });
    const token = header.slice(7).trim();
    if (!token || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      return res.status(401).json({ success: false, message: 'Invalid authentication token' });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'], issuer: 'vector-engineers-api', audience: 'vector-engineers-admin' });
    const admin = await Admin.findById(payload.sub).lean();
    if (!admin || !admin.isActive) return res.status(401).json({ success: false, message: 'Account inactive or unavailable' });
    req.admin = { id: String(admin._id), email: admin.email, displayName: admin.displayName, role: admin.role };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.name === 'NotBeforeError' || error.name === 'CastError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    next(error);
  }
}

function requireSuperAdmin(req, res, next) {
  if (req.admin?.role !== 'super_admin') return res.status(403).json({ success: false, message: 'Super Admin access required' });
  next();
}
module.exports = { requireAdmin, requireSuperAdmin };
