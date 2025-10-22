const { analyzeString } = require('../utils/stringAnalyzer.js');
const { addString, stringExists, findString } = require('../models/stringStore.js');


// Create and analyze a new string
const createString = (req, res) => {
    // Check if 'value' field exists in request body
    if (!req.body.value && req.body.value !== '') {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid request body or missing "value" field'
        });
    }

    // Validate that 'value' is a string
    if (typeof req.body.value !== 'string') {
        return res.status(422).json({
            error: 'Unprocessable Entity',
            message: 'Invalid data type for "value" (must be string)'
        });
    }

    const stringValue = req.body.value;

    // Check if string already exists
    if (stringExists(stringValue)) {
        return res.status(409).json({
            error: 'Conflict',
            message: 'String already exists in the system'
        });
    }

    //  Analyze the string
    const properties = analyzeString(stringValue);

    // Store the string with its properties
    const stringRecord = addString({
        id: properties.sha256_hash,
        value: stringValue,
        properties: properties
    });

    // Return 201 Created with the full data
    return res.status(201).json({
        id: properties.sha256_hash,
        value: stringRecord.value,
        properties: stringRecord.properties,
        created_at: stringRecord.created_at
    });
}

// Get a specific string
const getString = (req, res) => {
    // Get the string value from URL parameter and decode it
    const stringValue = decodeURIComponent(req.params.string_value);

    // Find the string in our data store
    const stringRecord = findString(stringValue);

    // If not found, return 404
    if (!stringRecord) {
        return res.status(404).json({
            error: 'Not Found',
            message: 'String does not exist in the system'
        });
    }

    // Return the string data
    return res.status(200).json({
        id: stringRecord.id,
        value: stringRecord.value,
        properties: stringRecord.properties,
        created_at: stringRecord.created_at
    });
};

module.exports = {
    createString,
    getString
};