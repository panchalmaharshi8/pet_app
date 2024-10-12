// routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Define routes for the 'users' resource
router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
