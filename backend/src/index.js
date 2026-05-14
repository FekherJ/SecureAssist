const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

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

    const prompt = `
You are an information security project integration assistant.

Analyze the following project from an ISP perspective.

Return the answer with the following sections:
1. Project summary
2. Main security risks
3. ISP questions to ask
4. Missing documents
5. Recommended actions

Focus on:
- authentication
- authorization
- data protection
- API exposure
- logging and monitoring
- operational risks
- compliance risks

Project:
${projectDescription}
`;

    const response = await axios.post(
      `${AI_SERVICE_URL}/generate`,
      {
        prompt,
        temperature: 0.2,
        max_tokens: 1000,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    res.json({
      workflow: 'isp-security-analysis',
      projectDescription,
      prompt,
      analysis: response.data.response,
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
