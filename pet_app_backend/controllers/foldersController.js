// controllers/foldersController.js
const db = require('../db/dbConfig');

// Create a new folder
exports.createFolder = (req, res) => {
    const { folder_name, pet_id } = req.body;
    const sql = 'INSERT INTO folders (folder_name, pet_id) VALUES (?, ?)';
    db.query(sql, [folder_name, pet_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Folder created', folderId: result.insertId });
    });
};

// Get all folders
exports.getAllFolders = (req, res) => {
    const sql = 'SELECT * FROM folders';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

// Update a folder by ID
exports.updateFolder = (req, res) => {
    const { id } = req.params;
    const { folder_name } = req.body;
    const sql = 'UPDATE folders SET folder_name = ? WHERE folder_id = ?';
    db.query(sql, [folder_name, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Folder updated' });
    });
};

// Delete a folder by ID
exports.deleteFolder = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM folders WHERE folder_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Folder deleted' });
    });
};
