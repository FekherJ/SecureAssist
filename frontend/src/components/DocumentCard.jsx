export default function DocumentCard({
  document,
  isExpanded,
  onToggleContent,
  onDelete,
}) {
  return (
    <article className="document-card">
      <div className="document-card-header">
        <div>
          <h2>{document.title}</h2>
          <p>{document.documentType}</p>
        </div>

        <span className="document-id">ID: {document.id}</span>
      </div>

      <div className="prompt-meta">
        <span>Created: {new Date(document.createdAt).toLocaleString()}</span>
      </div>

      <div className="prompt-actions">
        <button type="button" onClick={() => onToggleContent(document.id)}>
          {isExpanded ? "Hide content" : "Show content"}
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={() => onDelete(document.id)}
        >
          Delete document
        </button>
      </div>

      {isExpanded && (
        <pre className="document-content-preview">{document.contentText}</pre>
      )}
    </article>
  );
}
