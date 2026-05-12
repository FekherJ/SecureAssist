const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'secureassist-backend' });
});

app.post('/api/ai/generate', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/generate`, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('AI proxy error', error.message || error);
    const status = error.response?.status || 500;
    res.status(status).json({ error: 'AI service unavailable', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
