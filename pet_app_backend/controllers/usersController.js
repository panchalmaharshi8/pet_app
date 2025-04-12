// controllers/usersController.js
const db = require('../db/dbConfig');

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, password, phone]
    );
    res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM users');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone } = req.body;
  try {
    await db.query(
      'UPDATE users SET name = ?, email = ?, password = ?, phone = ? WHERE user_id = ?',
      [name, email, password, phone, id]
    );
    res.status(200).json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE user_id = ?', [id]);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userid; // make sure authMiddleware sets this
    const [rows] = await db.query(
      'SELECT user_id, name, email FROM users WHERE user_id = ?',
      [userId]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
};
