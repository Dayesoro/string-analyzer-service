const express = require('express');
const router = express.Router();
const { createString, getString, deleteString, getAllStrings, filterByNaturalLanguage } = require('../controllers/stringControllers');

// Create and analyze a new string
router.post('/strings', createString);

// filter-by-natural-language - MUST come before /:string_value
router.get('/strings/filter-by-natural-language', filterByNaturalLanguage);

// Get all strings with optional filters
router.get('/strings', getAllStrings)

// Get a specific string
router.get('/strings/:string_value', getString);

// Delete a specific string
router.delete('/strings/:string_value', deleteString);

module.exports = router;