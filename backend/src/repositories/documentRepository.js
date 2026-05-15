const pool = require('../db/pool');

async function createDocument({ title, documentType, contentText }) {
  const result = await pool.query(
    `
    INSERT INTO documents (title, document_type, content_text)
    VALUES ($1, $2, $3)
    RETURNING id, title, document_type, content_text, created_at, updated_at
    `,
    [title, documentType, contentText]
  );

  return result.rows[0];
}

async function getDocuments() {
  const result = await pool.query(
    `
    SELECT id, title, document_type, content_text, created_at, updated_at
    FROM documents
    ORDER BY created_at DESC
    `
  );

  return result.rows;
}

async function getDocumentById(id) {
  const result = await pool.query(
    `
    SELECT id, title, document_type, content_text, created_at, updated_at
    FROM documents
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function deleteDocumentById(id) {
  const result = await pool.query(
    `
    DELETE FROM documents
    WHERE id = $1
    RETURNING id, title, document_type
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createDocument,
  getDocuments,
  getDocumentById,
  deleteDocumentById,
};
