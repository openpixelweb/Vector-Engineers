const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('node:path');
const healthRoutes = require('./routes/health.routes');
const catalogRoutes = require('./routes/catalog.routes');
const authRoutes = require('./routes/auth.routes');
const adminCatalogRoutes = require('./routes/admin-catalog.routes');
const media = require('./routes/media.routes');
const publicCatalogueRoutes = require('./routes/public-catalogue.routes');

const app = express();
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '250kb' }));
app.use('/media', express.static(media.baseDirectory, { index: false, dotfiles: 'deny', maxAge: '1h', setHeaders: (res, file) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (file.endsWith('.pdf')) res.setHeader('Content-Disposition', 'inline');
}}));
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/admin/media', media.router);
app.use('/api/v1/admin/catalog', adminCatalogRoutes);
app.use('/api/v1/catalogue', publicCatalogueRoutes);
app.use('/api/v1/admin', authRoutes);
app.use('/api/v1', catalogRoutes);
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error('API error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});
module.exports = app;
