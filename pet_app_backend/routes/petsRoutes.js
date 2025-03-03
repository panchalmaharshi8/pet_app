// routes/petsRoutes.js
const express = require('express');
const router = express.Router();
const petsController = require('../controllers/petsController');
const authenticateToken = require('../middleware/authMiddleware'); // Import the middleware
const multer = require('multer');
const path = require('path');
const db = require('../db/dbConfig'); // Adjust the path to your dbConfig.js file

console.log("✅ petsRoutes.js has been loaded!");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename files with a timestamp
    },
});

const upload = multer({ storage: storage });

router.post('/', authenticateToken, upload.single('photo'), async (req, res) => {
    const { name, breed, birthday } = req.body;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    const owner_id = req.user.userId; // This comes from the JWT token

    try {
        const [result] = await db.promise().query(
            'INSERT INTO pets (name, breed, birthday, photo_url, medical_summary, owner_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, breed, birthday, photo_url, '', owner_id]
        );

        res.status(201).json({
            message: 'Pet added successfully',
            petId: result.insertId,
            photo_url,
        });
    } catch (err) {
        console.error('Failed to add pet:', err);
        res.status(500).json({ error: 'Failed to add pet' });
    }
});


// GET Route to Get a pet
router.get('/', authenticateToken, async (req, res) => {
    console.log('Fetching pets for userId:', req.user.userId); // Debug log
    try {
        const userId = req.user.userId;
        const [pets] = await db.promise().query('SELECT * FROM pets WHERE owner_id = ?', [userId]);
        res.status(200).json(pets);
    } catch (err) {
        console.error('Error fetching pets:', err);
        res.status(500).json({ error: 'Failed to fetch pets' });
    }
});

// GET a specific pet by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params; // Extract pet ID from route params
        const userId = req.user.userId; // Extract user ID from token
        const [pet] = await db.promise().query('SELECT * FROM pets WHERE pet_id = ? AND owner_id = ?', [id, userId]);

        if (pet.length === 0) {
            return res.status(404).json({ error: 'Pet not found or access denied' });
        }

        res.status(200).json(pet[0]);
    } catch (err) {
        console.error('Error fetching pet details:', err);
        res.status(500).json({ error: 'Failed to fetch pet details' });
    }
});


// PUT Route to Update a Pet
router.put('/:id', authenticateToken, petsController.updatePet);

// DELETE Route to Remove a Pet
router.delete('/:id', authenticateToken, petsController.deletePet);

router.put('/change-owner', authenticateToken, (req, res, next) => {
    console.log("🚀 Route `/pets/change-owner` Hit - Passing to Controller...");
    next();
}, petsController.transferPetOwnership);


// router.put('/transfer', authenticateToken, (req, res, next) => {
//     console.log("🚀 Route `/pets/transfer` Hit - Passing to Controller...");
//     next();
// }, petsController.transferPetOwnership);


module.exports = router;
