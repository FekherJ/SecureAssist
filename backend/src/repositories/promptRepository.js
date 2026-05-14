const pool = require('../db/pool');

async function getActivePromptTemplate(useCase) {
  const result = await pool.query(
    `
    SELECT id, name, version, use_case, template, is_active
    FROM prompt_templates
    WHERE use_case = $1
      AND is_active = true
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [useCase]
  );

  return result.rows[0] || null;
}

async function checkDatabaseConnection() {
  const result = await pool.query('SELECT 1 AS connected');
  return result.rows[0]?.connected === 1;
}

module.exports = {
  getActivePromptTemplate,
  checkDatabaseConnection,
};
