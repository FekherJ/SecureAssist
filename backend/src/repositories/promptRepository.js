const pool = require('../db/pool');

async function getActivePromptTemplate(useCase) {
  const result = await pool.query(
    `
    SELECT id, name, version, use_case, template, is_active, created_at, updated_at
    FROM prompt_templates
    WHERE use_case = $1
      AND is_active = true
    ORDER BY is_active DESC, created_at DESC
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

async function getPromptTemplates(useCase) {
  const values = [];
  let whereClause = '';

  if (useCase) {
    values.push(useCase);
    whereClause = 'WHERE use_case = $1';
  }

  const result = await pool.query(
    `
    SELECT id, name, version, use_case, template, is_active, created_at, updated_at
    FROM prompt_templates
    ${whereClause}
    ORDER BY is_active DESC, created_at DESC
    `,
    values
  );

  return result.rows;
}

async function createPromptTemplate({ name, version, useCase, template, isActive = false }) {
  const result = await pool.query(
    `
    INSERT INTO prompt_templates (name, version, use_case, template, is_active)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, version, use_case, template, is_active, created_at, updated_at
    `,
    [name, version, useCase, template, isActive]
  );

  return result.rows[0];
}

async function activatePromptTemplate(id) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const promptResult = await client.query(
      `
      SELECT id, use_case
      FROM prompt_templates
      WHERE id = $1
      `,
      [id]
    );

    const prompt = promptResult.rows[0];

    if (!prompt) {
      const error = new Error(`Prompt template not found with id: ${id}`);
      error.status = 404;
      throw error;
    }

    await client.query(
      `
      UPDATE prompt_templates
      SET is_active = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE use_case = $1
      `,
      [prompt.use_case]
    );

    const activatedResult = await client.query(
      `
      UPDATE prompt_templates
      SET is_active = true,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, version, use_case, template, is_active, created_at, updated_at
      `,
      [id]
    );

    await client.query('COMMIT');

    return activatedResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function deletePromptTemplate(id) {
  const result = await pool.query(
    `
    DELETE FROM prompt_templates
    WHERE id = $1
      AND is_active = false
    RETURNING id, name, version, use_case, is_active
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  getActivePromptTemplate,
  checkDatabaseConnection,
  getPromptTemplates,
  createPromptTemplate,
  activatePromptTemplate,
  deletePromptTemplate,
};
