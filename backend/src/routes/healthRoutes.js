const express = require('express');

const { getDatabaseHealth } = require('../services/healthService');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'secureassist-backend',
  });
});

router.get('/health/db', async (req, res) => {
  try {
    const health = await getDatabaseHealth();
    res.json(health);
  } catch (error) {
    console.error('Database health check failed', error.message || error);

    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      details: error.message,
    });
  }
});

module.exports = router;
