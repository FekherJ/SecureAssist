const express = require('express');

const {
  getActivePrompt,
  listPrompts,
  createPrompt,
  activatePrompt,
} = require('../services/promptService');

const router = express.Router();

router.get('/api/prompts', async (req, res) => {
  try {
    const prompts = await listPrompts(req.query.useCase);
    res.json(prompts);
  } catch (error) {
    console.error('Prompt list failed', error.message || error);

    const status = error.status || 500;
    res.status(status).json({
      error: 'Prompt list failed',
      details: error.message,
    });
  }
});

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

router.post('/api/prompts', async (req, res) => {
  try {
    const prompt = await createPrompt(req.body);
    res.status(201).json(prompt);
  } catch (error) {
    console.error('Prompt creation failed', error.message || error);

    const status = error.status || 500;
    res.status(status).json({
      error: 'Prompt creation failed',
      details: error.message,
    });
  }
});

router.patch('/api/prompts/:id/activate', async (req, res) => {
  try {
    const prompt = await activatePrompt(Number(req.params.id));
    res.json(prompt);
  } catch (error) {
    console.error('Prompt activation failed', error.message || error);

    const status = error.status || 500;
    res.status(status).json({
      error: 'Prompt activation failed',
      details: error.message,
    });
  }
});

module.exports = router;
