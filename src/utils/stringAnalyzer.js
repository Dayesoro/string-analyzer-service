const crypto = require('crypto');

// Main function that analyzes a string and returns all properties
const analyzeString = (str) => {
    return {
        length: getLength(str),
        is_palindrome: isPalindrome(str),
        unique_characters: getUniqueCharacterCount(str),
        word_count: getWordCount(str),
        sha256_hash: getSHA256Hash(str),
        character_frequency_map: getCharacterFrequencyMap(str)
    };
};

// Get the length of the string
const getLength = (str) => {
    return str.length;
};

// Check if string is a palindrome (case-insensitive)
const isPalindrome = (str) => {
    // Remove spaces and convert to lowercase for comparison
    const cleaned = str.replace(/\s/g, '').toLowerCase();
    const reversed = cleaned.split('').reverse().join('');
    return cleaned === reversed;
};

// Count unique characters
const getUniqueCharacterCount = (str) => {
    const uniqueChars = new Set(str);
    return uniqueChars.size;
};

// Count words (split by whitespace)
const getWordCount = (str) => {
    // Split by whitespace and filter out empty strings
    const words = str.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
};

// Generate SHA-256 hash
const getSHA256Hash = (str) => {
    return crypto.createHash('sha256').update(str).digest('hex');
};

// Create character frequency map
const getCharacterFrequencyMap = (str) => {
    const frequencyMap = {};

    for (let char of str) {
        frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    }

    return frequencyMap;
};

module.exports = {
    analyzeString
};
