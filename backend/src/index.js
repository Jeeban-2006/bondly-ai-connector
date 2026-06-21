import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generateMessage, generateInsights } from './services/ai.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validation middleware
const validateMessageRequest = (req, res, next) => {
  const { contactName, tone, length } = req.body;
  
  if (!contactName || typeof contactName !== 'string') {
    return res.status(400).json({ 
      error: 'contactName is required and must be a string' 
    });
  }
  
  const validTones = ['Warm', 'Funny', 'Formal'];
  if (tone && !validTones.includes(tone)) {
    return res.status(400).json({ 
      error: `tone must be one of: ${validTones.join(', ')}` 
    });
  }
  
  const validLengths = ['Short', 'Medium', 'Long'];
  if (length && !validLengths.includes(length)) {
    return res.status(400).json({ 
      error: `length must be one of: ${validLengths.join(', ')}` 
    });
  }
  
  next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Bondly AI Connector Backend is running',
    timestamp: new Date().toISOString(),
    ai: !!process.env.GEMINI_API_KEY,
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to Bondly AI Connector API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      generateMessage: 'POST /api/ai/generate-message',
      generateInsights: 'POST /api/ai/insights',
    }
  });
});

// AI message generation endpoint
app.post('/api/ai/generate-message', validateMessageRequest, async (req, res) => {
  try {
    const { 
      contactName, 
      tone = 'Warm', 
      length = 'Medium',
      relationshipType,
      importanceLevel,
      lastContacted,
      healthScore,
      recentNotes,
      context 
    } = req.body;

    const message = await generateMessage({
      contactName,
      tone,
      length,
      relationshipType,
      importanceLevel,
      lastContacted,
      healthScore,
      recentNotes,
      context,
    });

    res.json({ 
      success: true,
      message,
      metadata: {
        tone,
        length,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    if (error.message.includes('API key')) {
      return res.status(401).json({ 
        success: false,
        error: 'OpenAI API configuration error',
        message: error.message 
      });
    }
    
    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      return res.status(429).json({ 
        success: false,
        error: 'AI service temporarily unavailable',
        message: error.message 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Failed to generate message',
      message: error.message 
    });
  }
});

// AI insights generation endpoint
app.post('/api/ai/insights', async (req, res) => {
  try {
    const { contacts } = req.body;

    if (!Array.isArray(contacts)) {
      return res.status(400).json({ 
        success: false,
        error: 'contacts must be an array' 
      });
    }

    const insights = await generateInsights(contacts);

    res.json({ 
      success: true,
      insights,
      metadata: {
        contactCount: contacts.length,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    if (error.message.includes('API key')) {
      return res.status(401).json({ 
        success: false,
        error: 'OpenAI API configuration error',
        message: error.message 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Failed to generate insights',
      message: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Endpoint ${req.method} ${req.path} not found`,
    availableEndpoints: ['/api', '/api/health', '/api/ai/generate-message', '/api/ai/insights']
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
});

export default app;
