const express = require('express');
const router = express.Router();
const legalDocController = require('../Controller/legalDoc.controller');
const { authenticateToken } = require('../Middlewares/auth.middleware');

// Protected routes - require authentication
router.get('/docs', authenticateToken, legalDocController.getLegalDocs);
router.get('/docs/:id', authenticateToken, legalDocController.getLegalDocById);
router.get('/docs/recent', authenticateToken, legalDocController.getRecentLegalDocs);

module.exports = router; 