const express = require('express');
const router = express.Router();
const legalController = require('../Controller/legal.controller');

// Only keep the submit-legal-case route, but without multer
router.post('/submit-legal-case', legalController.submitLegalCase);

module.exports = router;


