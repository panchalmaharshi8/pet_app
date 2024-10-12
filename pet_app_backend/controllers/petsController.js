// controllers/petsController.js
const db = require('../db/dbConfig');

// Create a new pet
exports.createPet = (req, res) => {
    const { name, breed, age, photo_url, medical_summary, owner_id } = req.body;
    const sql = 'INSERT INTO pets (name, breed, age, photo_url, medical_summary, owner_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, breed, age, photo_url, medical_summary, owner_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Pet created', petId: result.insertId });
    });
};

// Get all pets
exports.getAllPets = (req, res) => {
    const sql = 'SELECT * FROM pets';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

// Update a pet by ID
exports.updatePet = (req, res) => {
    const { id } = req.params;
    const { name, breed, age, photo_url, medical_summary } = req.body;
    const sql = 'UPDATE pets SET name = ?, breed = ?, age = ?, photo_url = ?, medical_summary = ? WHERE pet_id = ?';
    db.query(sql, [name, breed, age, photo_url, medical_summary, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Pet updated' });
    });
};

// Delete a pet by ID
exports.deletePet = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM pets WHERE pet_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Pet deleted' });
    });
};
