// server.js
require('dotenv').config(); // Load environment variables (if needed)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
const usersRoutes = require('./routes/usersRoutes');
const petsRoutes = require('./routes/petsRoutes');
const foldersRoutes = require('./routes/foldersRoutes');
const documentsRoutes = require('./routes/documentsRoutes');
const authRoutes = require('./routes/authRoutes'); // New auth route

// Route Handling
app.use(cors());
app.use('/users', usersRoutes);
app.use('/pets', petsRoutes);
app.use('/folders', foldersRoutes);
app.use('/documents', documentsRoutes);
app.use('/auth', authRoutes); // New auth route

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
