require('dotenv').config();
const express = require('express');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3005;

// Middleware for parsing JSON request bodies
app.use(express.json());


// Basic route to test server is working
app.get('/', (req, res) => {
    res.json({
        message: 'String Analyzer Service is running!'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;