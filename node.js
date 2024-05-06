const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // Import dotenv package to read .env file

const app = express();
const port = process.env.PORT || 3000;

// Define a route for the custom API endpoint
app.post('/custom-endpoint', async (req, res) => {
    try {
        // Extract user query from request body
        const userQuery = req.body.query;

        // Forward user query to OpenAI API for processing
        const response = await fetch('https://api.openai.com/v1/assistants/asst_gCuYfPI72cGyMYuuWC34rWYj/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use environment variable for API key
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: userQuery }]
            })
        });

        // Parse OpenAI API response
        const data = await response.json();

        // Send OpenAI API response back to client
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
