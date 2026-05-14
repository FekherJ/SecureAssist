const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

async function generateText(payload) {
  const response = await axios.post(`${AI_SERVICE_URL}/generate`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
}

module.exports = {
  generateText,
};
