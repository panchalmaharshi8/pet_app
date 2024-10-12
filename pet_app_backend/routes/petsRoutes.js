// routes/petsRoutes.js
const express = require('express');
const router = express.Router();
const petsController = require('../controllers/petsController');

// Define routes for the 'pets' resource
router.post('/', petsController.createPet);
router.get('/', petsController.getAllPets);
router.put('/:id', petsController.updatePet);
router.delete('/:id', petsController.deletePet);

module.exports = router;
