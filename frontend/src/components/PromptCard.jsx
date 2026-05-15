export default function PromptCard({
  prompt,
  isExpanded,
  onTogglePreview,
  onActivate,
  onDelete,
}) {
  return (
    <article className="prompt-card">
      <div className="prompt-card-header">
        <div>
          <h2>{prompt.name}</h2>
          <p>{prompt.useCase}</p>
        </div>

        <span className={prompt.isActive ? "status-active" : "status-inactive"}>
          {prompt.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="prompt-meta">
        <span>Version: {prompt.version}</span>
        <span>ID: {prompt.id}</span>
      </div>

      <div className="prompt-actions">
        <button type="button" onClick={() => onTogglePreview(prompt.id)}>
          {isExpanded ? "Hide prompt" : "Show prompt"}
        </button>

        {!prompt.isActive && (
          <button type="button" onClick={() => onActivate(prompt.id)}>
            Activate this prompt
          </button>
        )}

        {!prompt.isActive && (
          <button
            type="button"
            className="danger-button"
            onClick={() => onDelete(prompt.id)}
          >
            Delete prompt
          </button>
        )}
      </div>

      {isExpanded && (
        <pre className="prompt-template-preview">{prompt.template}</pre>
      )}
    </article>
  );
}
