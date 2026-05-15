const pool = require('../db/pool');

async function createSecurityAnalysisRun({
  projectDescription,
  promptTemplateId,
  provider,
  model,
  structuredAnalysis,
  rawAnalysis,
}) {
  const result = await pool.query(
    `
    INSERT INTO security_analysis_runs (
      project_description,
      prompt_template_id,
      provider,
      model,
      structured_analysis,
      raw_analysis
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      project_description,
      prompt_template_id,
      provider,
      model,
      structured_analysis,
      raw_analysis,
      created_at
    `,
    [projectDescription, promptTemplateId, provider, model, structuredAnalysis, rawAnalysis]
  );

  return result.rows[0];
}

async function getSecurityAnalysisRuns() {
  const result = await pool.query(
    `
    SELECT
      id,
      project_description,
      prompt_template_id,
      provider,
      model,
      structured_analysis,
      raw_analysis,
      created_at
    FROM security_analysis_runs
    ORDER BY created_at DESC
    `
  );

  return result.rows;
}

async function getSecurityAnalysisRunById(id) {
  const result = await pool.query(
    `
    SELECT
      id,
      project_description,
      prompt_template_id,
      provider,
      model,
      structured_analysis,
      raw_analysis,
      created_at
    FROM security_analysis_runs
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createSecurityAnalysisRun,
  getSecurityAnalysisRuns,
  getSecurityAnalysisRunById,
};
