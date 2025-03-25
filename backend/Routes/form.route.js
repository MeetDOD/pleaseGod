const express = require('express');
const router = express.Router();
const legalController = require('../Controller/legal.controller');
const { authenticateToken } = require('../Middlewares/auth.middleware');

// Only keep the submit-legal-case route, but without multer
router.post('/submit-legal-case', authenticateToken, legalController.submitLegalCase);

module.exports = router;


