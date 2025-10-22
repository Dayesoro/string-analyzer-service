const { analyzeString } = require('../utils/stringAnalyzer.js');
const { addString, stringExists } = require('../models/stringStore.js');


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

module.exports = {
    createString
};