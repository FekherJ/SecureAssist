const express = require('express');

const { analyzeProjectSecurity } = require('../services/securityAnalysisService');

const router = express.Router();

router.post('/api/security/analyze', async (req, res) => {
  try {
    const { projectDescription } = req.body;

    if (!projectDescription || !projectDescription.trim()) {
      return res.status(400).json({
        error: 'Project description is required',
      });
    }

    const result = await analyzeProjectSecurity(projectDescription);
    res.json(result);
  } catch (error) {
    console.error('Security analysis error', error.message || error);

    const status = error.status || error.response?.status || 500;
    res.status(status).json({
      error: 'Security analysis failed',
      details: error.message,
    });
  }
});

module.exports = router;
