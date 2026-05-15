const express = require('express');

const { getActivePrompt } = require('../services/promptService');

const router = express.Router();

router.get('/api/prompts/active', async (req, res) => {
  try {
    const useCase = req.query.useCase || 'ISP_SECURITY_ANALYSIS';

    const prompt = await getActivePrompt(useCase);

    res.json(prompt);
  } catch (error) {
    console.error('Active prompt lookup failed', error.message || error);

    const status = error.status || 500;
    res.status(status).json({
      error: 'Active prompt lookup failed',
      details: error.message,
    });
  }
});

module.exports = router;
