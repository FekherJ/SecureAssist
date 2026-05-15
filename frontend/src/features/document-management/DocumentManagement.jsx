import { useEffect, useState } from "react";

import {
  createDocument,
  deleteDocument,
  fetchDocuments,
} from "../../api/documentApi";
import CreateDocumentForm from "../../components/CreateDocumentForm";
import DocumentCard from "../../components/DocumentCard";

export default function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const [expandedDocumentIds, setExpandedDocumentIds] = useState([]);

  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState("");

  const [newDocument, setNewDocument] = useState({
    title: "",
    documentType: "GENERAL",
    contentText: "",
  });

  const [createDocumentLoading, setCreateDocumentLoading] = useState(false);
  const [createDocumentError, setCreateDocumentError] = useState("");
  const [createDocumentSuccess, setCreateDocumentSuccess] = useState("");

  const loadDocuments = async () => {
    setDocumentsLoading(true);
    setDocumentsError("");

    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      setDocumentsError(err.message || "Network error");
    } finally {
      setDocumentsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleNewDocumentChange = (event) => {
    const { name, value } = event.target;

    setNewDocument((currentDocument) => ({
      ...currentDocument,
      [name]: value,
    }));
  };

  const handleCreateDocument = async (event) => {
    event.preventDefault();
    setCreateDocumentLoading(true);
    setCreateDocumentError("");
    setCreateDocumentSuccess("");

    try {
      const data = await createDocument(newDocument);

      setCreateDocumentSuccess(
        `Document "${data.title}" created successfully.`,
      );
      setNewDocument({
        title: "",
        documentType: "GENERAL",
        contentText: "",
      });

      await loadDocuments();
    } catch (err) {
      setCreateDocumentError(err.message || "Network error");
    } finally {
      setCreateDocumentLoading(false);
    }
  };

  const toggleDocumentContent = (documentId) => {
    setExpandedDocumentIds((currentIds) =>
      currentIds.includes(documentId)
        ? currentIds.filter((id) => id !== documentId)
        : [...currentIds, documentId],
    );
  };

  const handleDeleteDocument = async (documentId) => {
    setDocumentsError("");

    const confirmed = window.confirm(
      "Delete this document? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDocument(documentId);
      await loadDocuments();
    } catch (err) {
      setDocumentsError(err.message || "Network error");
    }
  };

  return (
    <>
      <header>
        <h1>Document Management</h1>
        <p>
          Store reference documents that can later be used as context for RAG
          and document-grounded security analysis.
        </p>
      </header>

      <div className="toolbar">
        <button
          type="button"
          onClick={loadDocuments}
          disabled={documentsLoading}
        >
          {documentsLoading ? "Refreshing..." : "Refresh documents"}
        </button>
      </div>

      {documentsError && <div className="alert error">{documentsError}</div>}

      <CreateDocumentForm
        newDocument={newDocument}
        loading={createDocumentLoading}
        error={createDocumentError}
        success={createDocumentSuccess}
        onChange={handleNewDocumentChange}
        onSubmit={handleCreateDocument}
      />

      <section className="document-list">
        {documentsLoading && (
          <p className="empty-state">Loading documents...</p>
        )}

        {!documentsLoading && documents.length === 0 && (
          <p className="empty-state">No document found.</p>
        )}

        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            isExpanded={expandedDocumentIds.includes(document.id)}
            onToggleContent={toggleDocumentContent}
            onDelete={handleDeleteDocument}
          />
        ))}
      </section>
    </>
  );
}
