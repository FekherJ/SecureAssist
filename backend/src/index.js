const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const { getActivePromptTemplate } = require('./promptRepository');

const app = express();
const PORT = process.env.PORT || 8000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'secureassist-backend',
  });
});

app.post('/api/ai/generate', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/generate`, req.body, {
      headers: { 'Content-Type': 'application/json' },
    });

    res.json(response.data);
  } catch (error) {
    console.error('AI proxy error', error.message || error);

    const status = error.response?.status || 500;
    res.status(status).json({
      error: 'AI service unavailable',
      details: error.message,
    });
  }
});

app.post('/api/security/analyze', async (req, res) => {
  try {
    const { projectDescription } = req.body;

    if (!projectDescription || !projectDescription.trim()) {
      return res.status(400).json({
        error: 'Project description is required',
      });
    }

    const promptTemplate = await getActivePromptTemplate('ISP_SECURITY_ANALYSIS');

    if (!promptTemplate) {
      return res.status(500).json({
        error: 'No active prompt template found for ISP security analysis',
      });
    }

    const prompt = promptTemplate.template.replace('{{projectDescription}}', projectDescription);

    const response = await axios.post(
      `${AI_SERVICE_URL}/generate`,
      {
        prompt,
        temperature: 0.1,
        max_tokens: 2000,
        response_format: 'json',
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    let structuredAnalysis = null;

    try {
      structuredAnalysis = JSON.parse(response.data.response);
    } catch (parseError) {
      console.warn('Could not parse AI response as JSON');
    }

    res.json({
      workflow: 'isp-security-analysis',
      projectDescription,
      promptTemplate: {
        id: promptTemplate.id,
        name: promptTemplate.name,
        version: promptTemplate.version,
        useCase: promptTemplate.use_case,
      },
      prompt,
      analysis: response.data.response,
      structuredAnalysis,
      provider: response.data.provider,
      model: response.data.model,
    });
  } catch (error) {
    console.error('Security analysis error', error.message || error);

    const status = error.response?.status || 500;
    res.status(status).json({
      error: 'Security analysis failed',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
