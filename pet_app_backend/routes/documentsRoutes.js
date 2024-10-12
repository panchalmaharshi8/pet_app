const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');

// Use `uploadDocument` for file uploads
// console.log("uploadDocument in routes:", documentsController.uploadDocument);
router.post('/upload', documentsController.uploadDocument);
// Optional: Separate function for creating a document without file upload
router.post('/', documentsController.createDocument);

router.get('/', documentsController.getAllDocuments);
router.put('/:id', documentsController.updateDocument);
router.delete('/:id', documentsController.deleteDocument);

module.exports = router;

