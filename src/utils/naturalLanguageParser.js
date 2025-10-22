// Parse natural language queries into filter objects
const parseNaturalLanguageQuery = (query) => {
    const filters = {};
    const lowerQuery = query.toLowerCase().trim();

    // Pattern 1: Word count - "single word", "two word", "three word", etc.
    const wordCountPatterns = {
        'single word': 1,
        'one word': 1,
        'two word': 2,
        'three word': 3,
        'four word': 4,
        'five word': 5,
    };

    for (const [pattern, count] of Object.entries(wordCountPatterns)) {
        if (lowerQuery.includes(pattern)) {
            filters.word_count = count;
            break;
        }
    }

    // Pattern 2: Palindrome - "palindrome", "palindromic"
    if (lowerQuery.includes('palindrome') || lowerQuery.includes('palindromic')) {
        filters.is_palindrome = true;
    }

    // Pattern 3: Length - "longer than X", "shorter than X", "at least X"
    const longerThanMatch = lowerQuery.match(/longer than (\d+)/);
    if (longerThanMatch) {
        filters.min_length = parseInt(longerThanMatch[1]) + 1;
    }

    const shorterThanMatch = lowerQuery.match(/shorter than (\d+)/);
    if (shorterThanMatch) {
        filters.max_length = parseInt(shorterThanMatch[1]) - 1;
    }

    const atLeastMatch = lowerQuery.match(/at least (\d+)/);
    if (atLeastMatch) {
        filters.min_length = parseInt(atLeastMatch[1]);
    }

    const atMostMatch = lowerQuery.match(/at most (\d+)/);
    if (atMostMatch) {
        filters.max_length = parseInt(atMostMatch[1]);
    }

    // Pattern 4: Contains character - "contain(s) letter X", "contain(s) the letter X", "with letter X"
    const containsLetterMatch = lowerQuery.match(/contain(?:s)?\s+(?:the\s+)?letter\s+([a-z])/);
    if (containsLetterMatch) {
        filters.contains_character = containsLetterMatch[1];
    }

    // Pattern 5: "first vowel" = 'a', "second vowel" = 'e', etc.
    const vowelMap = {
        'first vowel': 'a',
        'second vowel': 'e',
        'third vowel': 'i',
        'fourth vowel': 'o',
        'fifth vowel': 'u'
    };

    for (const [pattern, vowel] of Object.entries(vowelMap)) {
        if (lowerQuery.includes(pattern)) {
            filters.contains_character = vowel;
            break;
        }
    }

    // Pattern 6: "containing the letter X" or "with letter X"
    const containingMatch = lowerQuery.match(/containing\s+(?:the\s+)?letter\s+([a-z])/);
    if (containingMatch) {
        filters.contains_character = containingMatch[1];
    }

    return filters;
};

module.exports = {
    parseNaturalLanguageQuery
};