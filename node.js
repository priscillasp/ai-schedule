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

const express = require('express');
const OpenAI = require('openai');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({process.env.OPENAI_API_KEY);

// Define a route for creating threads
app.post('/threads', async (req, res) => {
  try {
    // Create a thread
    const thread = await createThread();
    // Send thread creation response
    res.json(thread);
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a route for creating messages within threads
app.post('/threads/:threadId/messages', async (req, res) => {
  try {
    const { threadId } = req.params;
    const { role, content } = req.body;
    // Create a message within the thread
    const message = await createMessageInThread(threadId, role, content);
    // Send message creation response
    res.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a route for retrieving messages within threads
app.get('/threads/:threadId/messages', async (req, res) => {
  try {
    const { threadId } = req.params;
    // Retrieve messages from the thread
    const messages = await retrieveMessagesFromThread(threadId);
    // Send messages retrieval response
    res.json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function createThread() {
  try {
    const response = await fetch(`https://api.openai.com/v1/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
}

async function createMessageInThread(threadId, role, content) {
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        role: role,
        content: content
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

async function retrieveMessagesFromThread(threadId) {
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving messages:', error);
    throw error;
  }
}
