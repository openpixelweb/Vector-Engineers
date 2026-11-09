const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { rateLimit } = require('express-rate-limit');
const Admin = require('../models/admin.model');
const { requireAdmin } = require('../middleware/require-admin');
const router = express.Router();

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' } });

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || !email.trim() || !password || password.length > 200) {
      return res.status(400).json({ success: false, message: 'Valid email and password are required' });
    }
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      return res.status(503).json({ success: false, message: 'Authentication is not configured' });
    }
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    const verified = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
    if (!admin || !admin.isActive || !verified) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const accessToken = jwt.sign({}, process.env.JWT_SECRET, {
      subject: String(admin._id), expiresIn: '1h', algorithm: 'HS256',
      issuer: 'vector-engineers-api', audience: 'vector-engineers-admin'
    });
    await Admin.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });
    return res.json({ success: true, accessToken, tokenType: 'Bearer', expiresInSeconds: 3600,
      admin: { id: String(admin._id), email: admin.email, displayName: admin.displayName, role: admin.role } });
  } catch (error) { next(error); }
});

router.get('/me', requireAdmin, (req, res) => res.json({ success: true, admin: req.admin }));
module.exports = router;
