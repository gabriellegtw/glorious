import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables first, before any other imports
// Get the correct path to .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../../.env') });

const app = express();

// Add CORS middleware to allow frontend requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization'],  
}));

// Middleware 
app.use(express.json());

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test endpoint
app.get('/', async (req, res) => {
  res.send({
    status: "Started"
  })
});

app.post('/transcribe', async (req, res) => {
    try {
        if (!req.body.prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('Request Body:', req.body); 

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." }, 
                { role: "user", content: req.body.prompt }]
        }, {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
        });
        const messageContent = response.data.choices[0].message.content;
        res.json({ message: messageContent });
        } catch (error) {
            console.error('Error with OpenAI API:', error.message);
            res.status(500).json({ error: 'Failed to fetch response from OpenAI', details: error.message });
        }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});