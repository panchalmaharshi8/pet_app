// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup); // Register user
router.post('/login', authController.login);   // Log in user

module.exports = router;
