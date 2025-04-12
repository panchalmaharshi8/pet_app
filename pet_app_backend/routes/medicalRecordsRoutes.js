const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const medicalRecordsController = require('../controllers/medicalRecordsController');
const authenticateToken = require('../middleware/authMiddleware'); // ✅ Auth middleware
const db = require('../db/dbConfig');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/med_records'));
  },
  filename: (req, file, cb) => {
    cb(null, `misc_document_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ✅ Add medical record (protected)
router.post('/', authenticateToken, upload.single('file'), medicalRecordsController.addMedicalRecord);

// ✅ FIXED: Get records by pet ID (protected)
router.get('/:id', authenticateToken, medicalRecordsController.getMedicalRecordsByPetId);

// ✅ Update medical record (protected)
router.put('/:recordId', authenticateToken, upload.single('file'), (req, res) => {
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

    db.query(updateQuery, [type, newFile, recordId], (updateErr) => {
      if (updateErr) {
        console.error('Error updating record:', updateErr.message);
        return res.status(500).json({ error: 'Error updating record.' });
      }

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

// ✅ Delete medical record (protected)
router.delete('/:recordId', authenticateToken, async (req, res) => {
  const { recordId } = req.params;

  try {
    const filePathQuery = 'SELECT file_url FROM medical_records WHERE id = ?';
    const deleteQuery = 'DELETE FROM medical_records WHERE id = ?';

    db.query(filePathQuery, [recordId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching file path.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Record not found.' });
      }

      const filePath = path.join(__dirname, `../${results[0].file_url}`);

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr.message);
        }
      });

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
