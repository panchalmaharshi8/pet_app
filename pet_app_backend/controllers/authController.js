// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../db/dbConfig'); // Adjust this if needed to connect to your MySQL DB

// Email Transporter for Verification
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// controllers/authController.js
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
        await db.promise().query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, passwordHash]
        );

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error("Signup error:", error); // Log the actual error details
        res.status(500).json({ error: 'An error occurred during signup' });
    }
};

// controllers/authController.js
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (!user.length) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const validPassword = await bcrypt.compare(password, user[0].password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};



// // Email Verification Logic
// exports.verifyEmail = async (req, res) => {
//     const { token } = req.params;

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const [user] = await db.promise().query('SELECT * FROM users WHERE id = ?', [decoded.userId]);

//         if (!user.length) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         if (user[0].is_verified) {
//             return res.status(400).json({ message: "Account already verified" });
//         }

//         await db.promise().query('UPDATE users SET is_verified = ? WHERE id = ?', [true, decoded.userId]);
//         res.status(200).json({ message: "Email verified successfully" });
//     } catch (error) {
//         res.status(400).json({ error: "Invalid or expired token" });
//     }
// };
