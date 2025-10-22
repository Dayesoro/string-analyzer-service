const express = require('express');
const router = express.Router();
const { createString } = require('../controllers/stringControllers');

// Create and analyze a new string
router.post('/strings', createString);

module.exports = router;