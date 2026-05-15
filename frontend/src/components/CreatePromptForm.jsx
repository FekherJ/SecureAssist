export default function CreatePromptForm({
  newPrompt,
  loading,
  error,
  success,
  onChange,
  onSubmit,
}) {
  return (
    <section className="create-prompt-card">
      <h2>Create New Prompt Version</h2>

      <form onSubmit={onSubmit} className="prompt-form">
        <label htmlFor="promptName">Name</label>
        <input
          id="promptName"
          name="name"
          value={newPrompt.name}
          onChange={onChange}
          placeholder="ISP Security Analysis Prompt"
        />

        <label htmlFor="promptVersion">Version</label>
        <input
          id="promptVersion"
          name="version"
          value={newPrompt.version}
          onChange={onChange}
          placeholder="v3"
        />

        <label htmlFor="promptUseCase">Use case</label>
        <input
          id="promptUseCase"
          name="useCase"
          value={newPrompt.useCase}
          onChange={onChange}
          placeholder="ISP_SECURITY_ANALYSIS"
        />

        <label htmlFor="promptTemplate">Template</label>
        <textarea
          id="promptTemplate"
          name="template"
          value={newPrompt.template}
          onChange={onChange}
          placeholder="Write the prompt template here. Use {{projectDescription}} where the project description should be injected."
          rows="8"
        />

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="isActive"
            checked={newPrompt.isActive}
            onChange={onChange}
          />
          Activate this prompt immediately
        </label>

        <button
          type="submit"
          disabled={
            loading ||
            !newPrompt.name.trim() ||
            !newPrompt.version.trim() ||
            !newPrompt.useCase.trim() ||
            !newPrompt.template.trim()
          }
        >
          {loading ? "Creating..." : "Create prompt version"}
        </button>
      </form>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
    </section>
  );
}
