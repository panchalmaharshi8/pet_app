// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/dbConfig'); // Adjust this if needed to connect to your MySQL DB

// Signup Controller
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user into the database
        const [result] = await db.promise().query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, passwordHash]
        );

        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    } catch (error) {
        console.error("Signup error:", error.message); // Log the actual error details
        res.status(500).json({ error: 'An error occurred during signup' });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    try {
        // Check if the user exists
        const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (!user.length) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user[0].password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate a JWT with the user's ID (user_id)
        const token = jwt.sign({ userId: user[0].user_id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error("Login error:", error.message); // Log the error message
        res.status(500).json({ error: 'An error occurred during login' });
    }
};
