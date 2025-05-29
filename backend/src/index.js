require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000'
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Routes
app.post('/api/generate-content', async (req, res) => {
  try {
    const { contentType, prompt, referenceText } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional content writer for a senior living community. Create ${contentType} content that is engaging, informative, and appropriate for the target audience.`
        },
        {
          role: "user",
          content: `Reference material: ${referenceText}\n\nCreate ${contentType} based on this prompt: ${prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      message: error.message 
    });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 