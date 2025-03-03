const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const medicalRecordsController = require('../controllers/medicalRecordsController');
const db = require('../db/dbConfig');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/med_records')); // Save files in uploads/med_records
    },
    filename: (req, file, cb) => {
        cb(null, `misc_document_${Date.now()}${path.extname(file.originalname)}`); // Unique name for each file
    },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), medicalRecordsController.addMedicalRecord);

router.get('/:petId', medicalRecordsController.getMedicalRecordsByPetId);

router.put('/:recordId', upload.single('file'), (req, res) => {
    const { recordId } = req.params;
    const { type } = req.body;
    const newFile = req.file ? `/uploads/med_records/${req.file.filename}` : null;

    const selectQuery = 'SELECT file_url FROM medical_records WHERE id = ?';
    const updateQuery = `
        UPDATE medical_records 
        SET type = ?, file_url = COALESCE(?, file_url) 
        WHERE id = ?
    `;

    db.query(selectQuery, [recordId], (err, results) => {
        if (err) {
            console.error('Error fetching existing record:', err.message);
            return res.status(500).json({ error: 'Error fetching existing record.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Record not found.' });
        }

        const oldFileUrl = results[0].file_url;

        // Update the record
        db.query(updateQuery, [type, newFile, recordId], (updateErr) => {
            if (updateErr) {
                console.error('Error updating record:', updateErr.message);
                return res.status(500).json({ error: 'Error updating record.' });
            }

            // Delete the old file if a new file was uploaded
            if (newFile && oldFileUrl) {
                const oldFilePath = path.join(__dirname, `../${oldFileUrl}`);
                fs.unlink(oldFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting old file:', unlinkErr.message);
                    }
                });
            }

            res.status(200).json({ message: 'Record updated successfully.' });
        });
    });
});

router.delete('/:recordId', async (req, res) => {
    const { recordId } = req.params;

    try {
        const filePathQuery = 'SELECT file_url FROM medical_records WHERE id = ?';
        const deleteQuery = 'DELETE FROM medical_records WHERE id = ?';

        // Get the file path from the database
        db.query(filePathQuery, [recordId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching file path.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Record not found.' });
            }

            const filePath = path.join(__dirname, `../${results[0].file_url}`);

            // Delete the file from the filesystem
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting file:', unlinkErr.message);
                }
            });

            // Delete the record from the database
            db.query(deleteQuery, [recordId], (deleteErr) => {
                if (deleteErr) {
                    return res.status(500).json({ error: 'Error deleting record.' });
                }
                res.status(200).json({ message: 'Record deleted successfully.' });
            });
        });
    } catch (error) {
        console.error('Error in delete operation:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router;
