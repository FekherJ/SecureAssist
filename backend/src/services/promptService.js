const {
  getActivePromptTemplate,
  getPromptTemplates,
  createPromptTemplate,
  activatePromptTemplate,
  deletePromptTemplate,
} = require('../repositories/promptRepository');

function mapPromptTemplate(promptTemplate) {
  return {
    id: promptTemplate.id,
    name: promptTemplate.name,
    version: promptTemplate.version,
    useCase: promptTemplate.use_case,
    template: promptTemplate.template,
    isActive: promptTemplate.is_active,
    createdAt: promptTemplate.created_at,
    updatedAt: promptTemplate.updated_at,
  };
}

async function getActivePrompt(useCase) {
  const promptTemplate = await getActivePromptTemplate(useCase);

  if (!promptTemplate) {
    const error = new Error(`No active prompt template found for use case: ${useCase}`);
    error.status = 404;
    throw error;
  }

  return mapPromptTemplate(promptTemplate);
}

async function listPrompts(useCase) {
  const prompts = await getPromptTemplates(useCase);
  return prompts.map(mapPromptTemplate);
}

async function createPrompt(payload) {
  const { name, version, useCase, template, isActive } = payload;

  if (!name || !version || !useCase || !template) {
    const error = new Error('name, version, useCase and template are required');
    error.status = 400;
    throw error;
  }

  const prompt = await createPromptTemplate({
    name,
    version,
    useCase,
    template,
    isActive,
  });

  return mapPromptTemplate(prompt);
}

async function activatePrompt(id) {
  const prompt = await activatePromptTemplate(id);
  return mapPromptTemplate(prompt);
}

async function deletePrompt(id) {
  const deletedPrompt = await deletePromptTemplate(id);

  if (!deletedPrompt) {
    const error = new Error(
      `Prompt template not found or cannot be deleted because it is active: ${id}`
    );
    error.status = 400;
    throw error;
  }

  return {
    id: deletedPrompt.id,
    name: deletedPrompt.name,
    version: deletedPrompt.version,
    useCase: deletedPrompt.use_case,
    isActive: deletedPrompt.is_active,
  };
}

module.exports = {
  getActivePrompt,
  listPrompts,
  createPrompt,
  activatePrompt,
  deletePrompt,
};
