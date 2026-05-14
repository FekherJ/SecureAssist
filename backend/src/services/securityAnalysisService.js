const { generateText } = require('./aiService');
const { getActivePromptTemplate } = require('../repositories/promptRepository');

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

  return {
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
}

module.exports = {
  analyzeProjectSecurity,
};
