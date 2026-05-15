const { generateText } = require('./aiService');
const { getActivePromptTemplate } = require('../repositories/promptRepository');

const {
  createSecurityAnalysisRun,
  getSecurityAnalysisRunById,
  getSecurityAnalysisRuns,
} = require('../repositories/securityAnalysisRepository');

async function analyzeProjectSecurity(projectDescription) {
  const promptTemplate = await getActivePromptTemplate('ISP_SECURITY_ANALYSIS');

  if (!promptTemplate) {
    const error = new Error('No active prompt template found for ISP security analysis');
    error.status = 500;
    throw error;
  }

  const prompt = promptTemplate.template.replace('{{projectDescription}}', projectDescription);

  const aiResponse = await generateText({
    prompt,
    temperature: 0.1,
    max_tokens: 2000,
    response_format: 'json',
  });

  let structuredAnalysis = null;

  try {
    structuredAnalysis = JSON.parse(aiResponse.response);
  } catch (parseError) {
    console.warn('Could not parse AI response as JSON');
  }

  const result = {
    workflow: 'isp-security-analysis',
    projectDescription,
    promptTemplate: {
      id: promptTemplate.id,
      name: promptTemplate.name,
      version: promptTemplate.version,
      useCase: promptTemplate.use_case,
    },
    prompt,
    analysis: aiResponse.response,
    structuredAnalysis,
    provider: aiResponse.provider,
    model: aiResponse.model,
  };

  const savedRun = await createSecurityAnalysisRun({
    projectDescription,
    promptTemplateId: promptTemplate.id,
    provider: aiResponse.provider,
    model: aiResponse.model,
    structuredAnalysis,
    rawAnalysis: aiResponse.response,
  });

  return {
    ...result,
    analysisRunId: savedRun.id,
    createdAt: savedRun.created_at,
  };
}

async function listSecurityAnalysisHistory() {
  const runs = await getSecurityAnalysisRuns();

  return runs.map((run) => ({
    id: run.id,
    projectDescription: run.project_description,
    promptTemplateId: run.prompt_template_id,
    provider: run.provider,
    model: run.model,
    structuredAnalysis: run.structured_analysis,
    rawAnalysis: run.raw_analysis,
    createdAt: run.created_at,
  }));
}

async function getSecurityAnalysisHistoryItem(id) {
  const run = await getSecurityAnalysisRunById(id);

  if (!run) {
    const error = new Error(`Security analysis run not found with id: ${id}`);
    error.status = 404;
    throw error;
  }

  return {
    id: run.id,
    projectDescription: run.project_description,
    promptTemplateId: run.prompt_template_id,
    provider: run.provider,
    model: run.model,
    structuredAnalysis: run.structured_analysis,
    rawAnalysis: run.raw_analysis,
    createdAt: run.created_at,
  };
}

module.exports = {
  analyzeProjectSecurity,
  listSecurityAnalysisHistory,
  getSecurityAnalysisHistoryItem,
};
