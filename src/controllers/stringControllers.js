const { analyzeString } = require('../utils/stringAnalyzer.js');
const { addString, stringExists, findString, getAllStrings: getAllStringsFromStore, removeString } = require('../models/stringStore.js');


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

// Get all strings
const getAllStrings = (req, res) => {
    // Get all strings from stringStore
    let strings = getAllStringsFromStore();

    // Extract query parameters
    const {
        is_palindrome,
        min_length,
        max_length,
        word_count,
        contains_character
    } = req.query;

    // Track filters applied
    const filtersApplied = {};

    // Apply filters one by one

    // Filter by palindrome
    if (is_palindrome !== undefined) {
        const isPalindromeFilter = is_palindrome === 'true';
        strings = strings.filter(str => str.properties.is_palindrome === isPalindromeFilter);
        filtersApplied.is_palindrome = isPalindromeFilter;
    }

    // Filter by minimum length
    if (min_length !== undefined) {
        const minLen = parseInt(min_length);
        if (isNaN(minLen)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'min_length must be a valid integer'
            });
        }
        strings = strings.filter(str => str.properties.length >= minLen);
        filtersApplied.min_length = minLen;
    }

    // Filter by maximum length
    if (max_length !== undefined) {
        const maxLen = parseInt(max_length);
        if (isNaN(maxLen)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'max_length must be a valid integer'
            });
        }
        strings = strings.filter(str => str.properties.length <= maxLen);
        filtersApplied.max_length = maxLen;
    }

    // Filter by word count
    if (word_count !== undefined) {
        const wordCnt = parseInt(word_count);
        if (isNaN(wordCnt)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'word_count must be a valid integer'
            });
        }
        strings = strings.filter(str => str.properties.word_count === wordCnt);
        filtersApplied.word_count = wordCnt;
    }

    // Filter by contains character
    if (contains_character !== undefined) {
        if (typeof contains_character !== 'string' || contains_character.length !== 1) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'contains_character must be a single character'
            });
        }
        strings = strings.filter(str => str.value.includes(contains_character));
        filtersApplied.contains_character = contains_character;
    }


    // Return the results
    return res.status(200).json({
        data: strings,
        count: strings.length,
        filters_applied: filtersApplied
    });


}

// Delete a specific string
const deleteString = (req, res) => {
    // Get and decode the string value from URL parameter
    const stringValue = decodeURIComponent(req.params.string_value);

    // Try to remove the string
    const wasRemoved = removeString(stringValue);

    // If not found, return 404
    if (!wasRemoved) {
        return res.status(404).json({
            error: 'Not Found',
            message: 'String does not exist in the system'
        });
    }

    // Return 204 No Content (success with no body)
    return res.status(204).send();
};

module.exports = {
    createString,
    getString,
    getAllStrings,
    deleteString
};