const express = require('express');

const {
  analyzeProjectSecurity,
  getSecurityAnalysisHistoryItem,
  listSecurityAnalysisHistory,
} = require('../services/securityAnalysisService');
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

router.get('/api/security/history', async (req, res) => {
  try {
    const history = await listSecurityAnalysisHistory();
    res.json(history);
  } catch (error) {
    console.error('Security analysis history lookup failed', error.message || error);

    const status = error.status || 500;
    res.status(status).json({
      error: 'Security analysis history lookup failed',
      details: error.message,
    });
  }
});

router.get('/api/security/history/:id', async (req, res) => {
  try {
    const historyItem = await getSecurityAnalysisHistoryItem(Number(req.params.id));
    res.json(historyItem);
  } catch (error) {
    console.error('Security analysis history item lookup failed', error.message || error);

    const status = error.status || 500;
    res.status(status).json({
      error: 'Security analysis history item lookup failed',
      details: error.message,
    });
  }
});

module.exports = router;
