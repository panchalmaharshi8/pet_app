// server.js
require('dotenv').config(); // Load environment variables (if needed)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Middleware
app.use(bodyParser.json());

// Routes
const usersRoutes = require('./routes/usersRoutes');
const petsRoutes = require('./routes/petsRoutes');
const foldersRoutes = require('./routes/foldersRoutes');
const documentsRoutes = require('./routes/documentsRoutes');
const authRoutes = require('./routes/authRoutes'); // New auth route
const medicalRecordsRoutes = require('./routes/medicalRecordsRoutes');
const clinicsRoutes = require('./routes/clinicsRoutes');

// Route Handling
app.use(cors());
app.use('/users', usersRoutes);
app.use('/pets', petsRoutes);
app.use('/folders', foldersRoutes);
app.use('/documents', documentsRoutes);
app.use('/auth', authRoutes); // New auth route
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/medical-records', medicalRecordsRoutes);app.get('/', (req, res) => {
    res.send('Server is up and running!');
});
app.use('/api/clinics', clinicsRoutes); // ✅ THIS is the fix


app.use((req, res, next) => {
    console.log(`🛑 Request NOT Matched: ${req.method} ${req.url}`);
    res.status(404).json({ error: "Route Not Found" });
});
app.use((req, res, next) => {
    console.log(`🔥 Incoming Request: ${req.method} ${req.url}`);
    next();
});


app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`✅ Registered Route: ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                console.log(`✅ Registered Route: ${handler.route.path}`);
            }
        });
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
