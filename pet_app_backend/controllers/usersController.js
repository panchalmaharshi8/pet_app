// controllers/usersController.js
const db = require('../db/dbConfig');

// Create a new user
exports.createUser = (req, res) => {
    const { name, email, password, phone } = req.body;
    const sql = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, password, phone], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User created', userId: result.insertId });
    });
};

// Get all users
exports.getAllUsers = (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

// Update a user by ID
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, password, phone } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ?, password = ?, phone = ? WHERE user_id = ?';
    db.query(sql, [name, email, password, phone, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'User updated' });
    });
};

// Delete a user by ID
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE user_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'User deleted' });
    });
};
