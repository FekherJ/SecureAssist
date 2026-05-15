const {
  createDocument,
  deleteDocumentById,
  getDocumentById,
  getDocuments,
} = require('../repositories/documentRepository');

function mapDocument(document) {
  return {
    id: document.id,
    title: document.title,
    documentType: document.document_type,
    contentText: document.content_text,
    createdAt: document.created_at,
    updatedAt: document.updated_at,
  };
}

async function listDocuments() {
  const documents = await getDocuments();
  return documents.map(mapDocument);
}

async function getDocument(id) {
  const document = await getDocumentById(id);

  if (!document) {
    const error = new Error(`Document not found with id: ${id}`);
    error.status = 404;
    throw error;
  }

  return mapDocument(document);
}

async function createNewDocument(payload) {
  const { title, documentType = 'GENERAL', contentText } = payload;

  if (!title || !title.trim()) {
    const error = new Error('title is required');
    error.status = 400;
    throw error;
  }

  if (!contentText || !contentText.trim()) {
    const error = new Error('contentText is required');
    error.status = 400;
    throw error;
  }

  const document = await createDocument({
    title,
    documentType,
    contentText,
  });

  return mapDocument(document);
}

async function deleteDocument(id) {
  const deletedDocument = await deleteDocumentById(id);

  if (!deletedDocument) {
    const error = new Error(`Document not found with id: ${id}`);
    error.status = 404;
    throw error;
  }

  return {
    id: deletedDocument.id,
    title: deletedDocument.title,
    documentType: deletedDocument.document_type,
  };
}

module.exports = {
  listDocuments,
  getDocument,
  createNewDocument,
  deleteDocument,
};
