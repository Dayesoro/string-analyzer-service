const express = require('express');
const router = express.Router();
const { createString, getString, deleteString, getAllStrings } = require('../controllers/stringControllers');

// Create and analyze a new string
router.post('/strings', createString);

// Get all strings with optional filters
router.get('/strings', getAllStrings)

// Get a specific string
router.get('/strings/:string_value', getString);

// Delete a specific string
router.delete('/strings/:string_value', deleteString);

module.exports = router;