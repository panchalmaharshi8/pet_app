const db = require('../db/dbConfig');

// Add a medical record
exports.addMedicalRecord = (req, res) => {
    const { type, pet_id } = req.body;

    // Validate required fields
    if (!type || !pet_id || !req.file) {
        return res.status(400).json({ error: 'Type, pet_id, and file are required.' });
    }

    // Construct the file URL based on saved location
    const file_url = `/uploads/med_records/${req.file.filename}`;

    const sql = 'INSERT INTO medical_records (type, file_url, pet_id) VALUES (?, ?, ?)';
    db.query(sql, [type, file_url, pet_id], (err, result) => {
        if (err) {
            console.error('Error adding medical record:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Medical record added!', recordId: result.insertId });
    });
};

// Get medical records by pet ID
exports.getMedicalRecordsByPetId = (req, res) => {
    const { petId } = req.params;

    const sql = 'SELECT * FROM medical_records WHERE pet_id = ?';
    db.query(sql, [petId], (err, results) => {
        if (err) {
            console.error('Error fetching medical records:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

