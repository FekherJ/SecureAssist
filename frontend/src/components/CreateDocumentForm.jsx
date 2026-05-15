export default function CreateDocumentForm({
  newDocument,
  loading,
  error,
  success,
  onChange,
  onSubmit,
}) {
  return (
    <section className="create-prompt-card">
      <h2>Create New Document</h2>

      <form onSubmit={onSubmit} className="prompt-form">
        <label htmlFor="documentTitle">Title</label>
        <input
          id="documentTitle"
          name="title"
          value={newDocument.title}
          onChange={onChange}
          placeholder="Internal API Security Policy"
        />

        <label htmlFor="documentType">Document type</label>
        <input
          id="documentType"
          name="documentType"
          value={newDocument.documentType}
          onChange={onChange}
          placeholder="SECURITY_POLICY"
        />

        <label htmlFor="documentContent">Content</label>
        <textarea
          id="documentContent"
          name="contentText"
          value={newDocument.contentText}
          onChange={onChange}
          placeholder="Paste the document content here..."
          rows="8"
        />

        <button
          type="submit"
          disabled={
            loading ||
            !newDocument.title.trim() ||
            !newDocument.documentType.trim() ||
            !newDocument.contentText.trim()
          }
        >
          {loading ? "Creating..." : "Create document"}
        </button>
      </form>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
    </section>
  );
}
