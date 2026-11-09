const router = require('express').Router();
const mongoose = require('mongoose');
router.get('/', (_req, res) => {
  const state = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({ success: true, service: 'Vector Engineers Catalogue API', phase: 2, database: state, message: 'Catalogue schemas and read-only APIs are ready.' });
});
module.exports = router;
