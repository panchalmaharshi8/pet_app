// routes/documentsRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

// Protect the documents route
router.get('/', authenticateToken, (req, res) => {
    // Fetch documents from database
    // Use req.user.userId to get user-specific documents
});

module.exports = router;
