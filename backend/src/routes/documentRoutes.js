const express = require('express');

const {
  createNewDocument,
  deleteDocument,
  getDocument,
  listDocuments,
} = require('../services/documentService');

const router = express.Router();

router.get('/api/documents', async (req, res) => {
  try {
    const documents = await listDocuments();
    res.json(documents);
  } catch (error) {
    console.error('Document list failed', error.message || error);

    res.status(500).json({
      error: 'Document list failed',
      details: error.message,
    });
  }
});

router.get('/api/documents/:id', async (req, res) => {
  try {
    const document = await getDocument(Number(req.params.id));
    res.json(document);
  } catch (error) {
    console.error('Document lookup failed', error.message || error);

    const status = error.status || 500;
    res.status(status).json({
      error: 'Document lookup failed',
      details: error.message,
    });
  }
});

router.post('/api/documents', async (req, res) => {
  try {
    const document = await createNewDocument(req.body);
    res.status(201).json(document);
  } catch (error) {
    console.error('Document creation failed', error.message || error);

    const status = error.status || 500;
    res.status(status).json({
      error: 'Document creation failed',
      details: error.message,
    });
  }
});

router.delete('/api/documents/:id', async (req, res) => {
  try {
    const deletedDocument = await deleteDocument(Number(req.params.id));

    res.json({
      message: 'Document deleted successfully',
      document: deletedDocument,
    });
  } catch (error) {
    console.error('Document deletion failed', error.message || error);

    const status = error.status || 500;
    res.status(status).json({
      error: 'Document deletion failed',
      details: error.message,
    });
  }
});

module.exports = router;
