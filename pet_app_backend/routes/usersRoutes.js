// routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware'); // if you have one

// Define routes for the 'users' resource
router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

router.get('/me', authMiddleware, usersController.getCurrentUser); // ✅ New


module.exports = router;
