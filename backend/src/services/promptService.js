const { getActivePromptTemplate } = require('../repositories/promptRepository');

async function getActivePrompt(useCase) {
  const promptTemplate = await getActivePromptTemplate(useCase);

  if (!promptTemplate) {
    const error = new Error(`No active prompt template found for use case: ${useCase}`);
    error.status = 404;
    throw error;
  }

  return {
    id: promptTemplate.id,
    name: promptTemplate.name,
    version: promptTemplate.version,
    useCase: promptTemplate.use_case,
    isActive: promptTemplate.is_active,
  };
}

module.exports = {
  getActivePrompt,
};
