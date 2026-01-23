// server/server.js - Complete version with click counter

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { generateComments } = require('./ai-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// JSONBin configuration
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_API_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// Path for the counter file (fallback)
const COUNTER_FILE = path.join(__dirname, 'data', 'counter.json');

// Initialize counter file and directory
async function initializeCounter() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(COUNTER_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    // Check if counter file exists
    try {
      await fs.access(COUNTER_FILE);
      console.log('Counter file found');
    } catch {
      // File doesn't exist, create it with initial count
      await fs.writeFile(COUNTER_FILE, JSON.stringify({ 
        count: 0, 
        lastUpdated: new Date().toISOString(),
        startDate: new Date().toISOString()
      }, null, 2));
      console.log('Counter file initialized with count: 0');
    }
  } catch (error) {
    console.error('Error initializing counter:', error);
  }
}

// Function to increment and get counter from JSONBin
async function incrementCounter() {
  try {
    // If JSONBin is configured, use it
    if (JSONBIN_BIN_ID && JSONBIN_API_KEY) {
      // Read current count from JSONBin
      const getResponse = await fetch(JSONBIN_API_URL, {
        method: 'GET',
        headers: {
          'X-Master-Key': JSONBIN_API_KEY
        }
      });

      if (!getResponse.ok) {
        throw new Error(`JSONBin GET failed: ${getResponse.status}`);
      }

      const data = await getResponse.json();
      const counterData = data.record;

      // Increment count
      counterData.count += 1;
      counterData.lastUpdated = new Date().toISOString();

      
      // Update JSONBin
      const updateResponse = await fetch(JSONBIN_API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify(counterData)
      });

      if (!updateResponse.ok) {
        throw new Error(`JSONBin PUT failed: ${updateResponse.status}`);
      }

      console.log(`Counter incremented to: ${counterData.count} (JSONBin)`);
      return counterData.count;
    } else {
      // Fallback to local file
      const data = await fs.readFile(COUNTER_FILE, 'utf8');
      const counterData = JSON.parse(data);
      
      counterData.count += 1;
      counterData.lastUpdated = new Date().toISOString();
      
      await fs.writeFile(COUNTER_FILE, JSON.stringify(counterData, null, 2));
      
      console.log(`Counter incremented to: ${counterData.count} (local file)`);
      return counterData.count;
    }
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return null;
  }
}

// Function to get current counter value from JSONBin
async function getCounter() {
  try {
    // If JSONBin is configured, use it
    if (JSONBIN_BIN_ID && JSONBIN_API_KEY) {
      const response = await fetch(JSONBIN_API_URL, {
        method: 'GET',
        headers: {
          'X-Master-Key': JSONBIN_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`JSONBin GET failed: ${response.status}`);
      }

      const data = await response.json();
      const count = data.record.count || 0;
      console.log(`Counter retrieved: ${count} (JSONBin)`);
      return count;
    } else {
      // Fallback to local file
      const data = await fs.readFile(COUNTER_FILE, 'utf8');
      const counterData = JSON.parse(data);
      console.log(`Counter retrieved: ${counterData.count} (local file)`);
      return counterData.count;
    }
  } catch (error) {
    console.error('Error reading counter:', error);
    return 0;
  }
}

// API endpoint to get current counter value
app.get('/api/counter', async (req, res) => {
  try {
    const count = await getCounter();
    res.json({ count });
  } catch (error) {
    console.error('Counter API error:', error);
    res.status(500).json({ error: 'Failed to get counter' });
  }
});

// API endpoint for processing code with counter
app.post('/api/generate-comments', upload.single('codeFile'), async (req, res) => {
  try {
    // Get code from file upload or request body
    const code = req.file 
      ? req.file.buffer.toString() 
      : req.body.code;
    
    const context = req.body.context || '';
    
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }
    
    console.log('Processing code file...');
    
    // Generate comments using the AI service
    const commentedCode = await generateComments(code, context);
    
    // Only increment counter after successful comment generation
    const newCount = await incrementCounter();
    
    console.log('Code processing successful');
    
    // Return the commented code along with the new count
    res.json({ 
      commentedCode,
      clickCount: newCount 
    });
  } catch (error) {
    console.error('Error generating comments:', error);
    res.status(500).json({ 
      error: 'Failed to generate comments',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize counter on startup
initializeCounter().then(() => {
  console.log('Counter system initialized');
}).catch(err => {
  console.error('Failed to initialize counter:', err);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Counter file location: ${COUNTER_FILE}`);
});