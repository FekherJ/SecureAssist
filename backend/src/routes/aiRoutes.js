const express = require('express');

const { generateText } = require('../services/aiService');

const router = express.Router();

router.post('/api/ai/generate', async (req, res) => {
  try {
    const data = await generateText(req.body);
    res.json(data);
  } catch (error) {
    console.error('AI proxy error', error.message || error);

    const status = error.response?.status || 500;
    res.status(status).json({
      error: 'AI service unavailable',
      details: error.message,
    });
  }
});

module.exports = router;
