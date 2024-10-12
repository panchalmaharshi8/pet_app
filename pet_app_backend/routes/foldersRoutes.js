// routes/foldersRoutes.js
const express = require('express');
const router = express.Router();
const foldersController = require('../controllers/foldersController');

// Define routes for the 'folders' resource
router.post('/', foldersController.createFolder);
router.get('/', foldersController.getAllFolders);
router.put('/:id', foldersController.updateFolder);
router.delete('/:id', foldersController.deleteFolder);

module.exports = router;
