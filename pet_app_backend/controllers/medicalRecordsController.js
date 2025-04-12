const db = require('../db/dbConfig');

// Add a medical record
exports.addMedicalRecord = (req, res) => {
  const { type, pet_id } = req.body;

  if (!type || !pet_id || !req.file) {
    return res.status(400).json({ error: 'Type, pet_id, and file are required.' });
  }

  const file_url = `/uploads/med_records/${req.file.filename}`;

  const sql = 'INSERT INTO medical_records (type, file_url, pet_id) VALUES (?, ?, ?)';
  db.query(sql, [type, file_url, pet_id], (err, result) => {
    if (err) {
      console.error('Error adding medical record:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Medical record added!', recordId: result.insertId });
  });
};

exports.getMedicalRecordsByPetId = async (req, res) => {
    console.log('📥 [HIT] GET /medical-records/:id route');
    const petId = req.params.id;
    console.log('🔎 petId:', petId);
  
    try {
      console.log('📡 Running async query...');
      const [records] = await db.query(
        'SELECT * FROM medical_records WHERE pet_id = ?',
        [petId]
      );
      console.log('✅ Query complete. Records:', records);
      res.status(200).json(records);
    } catch (err) {
      console.error('❌ Query error:', err.message);
      res.status(500).json({ error: 'Failed to fetch medical records' });
    }
  };
  
// exports.getMedicalRecordsByPetId = (req, res) => {
//   console.log('📥 [HIT] GET /medical-records/:id route');
//   const petId = req.params.id;
//   console.log('🔎 petId:', petId);

//   const sql = 'SELECT * FROM medical_records WHERE pet_id = ?';
//   console.log('📡 Running query...');
//   db.query(sql, [petId], (err, results) => {
//     if (err) {
//       console.error('Error fetching medical records:', err.message);
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json(results);
//   });
// };
