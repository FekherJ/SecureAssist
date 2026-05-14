const { checkDatabaseConnection } = require('../repositories/promptRepository');

async function getDatabaseHealth() {
  const isConnected = await checkDatabaseConnection();

  return {
    status: isConnected ? 'ok' : 'error',
    database: isConnected ? 'connected' : 'disconnected',
  };
}

module.exports = {
  getDatabaseHealth,
};
