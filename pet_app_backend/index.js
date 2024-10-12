// index.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
const usersRoutes = require('./routes/usersRoutes');
const petsRoutes = require('./routes/petsRoutes');
const foldersRoutes = require('./routes/foldersRoutes');
const documentsRoutes = require('./routes/documentsRoutes');

// Route Handling
app.use('/users', usersRoutes);
app.use('/pets', petsRoutes);
app.use('/folders', foldersRoutes);
app.use('/documents', documentsRoutes);

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

