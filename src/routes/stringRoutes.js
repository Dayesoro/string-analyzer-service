const express = require('express');
const router = express.Router();
const { createString, getString } = require('../controllers/stringControllers');

// Create and analyze a new string
router.post('/strings', createString);

// Get a specific string
router.get('/strings/:string_value', getString);

module.exports = router;