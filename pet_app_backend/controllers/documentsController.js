// controllers/documentsController.js
const db = require('../db/dbConfig');
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');  // Files will be stored in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Rename file with timestamp
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Set file size limit to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|pdf/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed.'));
        }
    }
});

// Upload a new document
exports.uploadDocument = (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { title, folder_id, pet_id } = req.body;
        const file_url = req.file ? req.file.path : null;

        const sql = 'INSERT INTO documents (title, file_url, folder_id, pet_id) VALUES (?, ?, ?, ?)';
        db.query(sql, [title, file_url, folder_id, pet_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Document uploaded', documentId: result.insertId });
        });
    });
};

// Upload a new document
exports.createDocument = (req, res) => {
    const { title, file_url, folder_id, pet_id } = req.body;
    const sql = 'INSERT INTO documents (title, file_url, folder_id, pet_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, file_url, folder_id, pet_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Document uploaded', documentId: result.insertId });
    });
};

// Get all documents
exports.getAllDocuments = (req, res) => {
    const sql = 'SELECT * FROM documents';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

// Update a document by ID
exports.updateDocument = (req, res) => {
    const { id } = req.params;
    const { title, file_url } = req.body;
    const sql = 'UPDATE documents SET title = ?, file_url = ? WHERE document_id = ?';
    db.query(sql, [title, file_url, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Document updated' });
    });
};

// Delete a document by ID
exports.deleteDocument = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM documents WHERE document_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Document deleted' });
    });
};
