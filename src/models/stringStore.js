// In-memory storage for analyzed strings
// Key: string value, Value: analyzed string object
const stringsDB = {};

// Add a new analyzed string
const addString = (stringData) => {
    const stringRecord = {
        ...stringData,
        created_at: new Date().toISOString()
    };

    stringsDB[stringData.value] = stringRecord;
    console.log(stringsDB)
    return stringRecord;
};

// Find a string by its value
const findString = (value) => {
    return stringsDB[value] || null;
};

// Get all strings as an array
const getAllStrings = () => {
    return Object.values(stringsDB);
};

// Remove a string by its value
const removeString = (value) => {
    if (stringsDB[value]) {
        delete stringsDB[value];
        return true;
    }
    return false;
};

// Check if a string exists
const stringExists = (value) => {
    return stringsDB.hasOwnProperty(value);
};

module.exports = {
    addString,
    findString,
    getAllStrings,
    removeString,
    stringExists
};