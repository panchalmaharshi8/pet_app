// controllers/petsController.js
const db = require('../db/dbConfig');

// Create a new pet
exports.createPet = (req, res) => {
    const { name, breed, birthday, photo_url, medical_summary, owner_id } = req.body;
    const sql = 'INSERT INTO pets (name, breed, birthday, photo_url, medical_summary, owner_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, breed, birthday, photo_url, medical_summary, owner_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Pet created', petId: result.insertId });
    });
};

// Get all pets
exports.getAllPets = (req, res) => {
    const sql = 'SELECT * FROM pets';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

// Update a pet by ID
exports.updatePet = (req, res) => {
    const { id } = req.params;
    const { name, breed, birthday, photo_url, medical_summary } = req.body;
    const sql = 'UPDATE pets SET name = ?, breed = ?, birthday = ?, photo_url = ?, medical_summary = ? WHERE pet_id = ?';
    db.query(sql, [name, breed, birthday, photo_url, medical_summary, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Pet updated' });
    });
};

// Delete a pet by ID
exports.deletePet = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM pets WHERE pet_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Pet deleted' });
    });
};

exports.transferPetOwnership = (req, res) => {
    let { petId, newOwnerEmail } = req.body;

    console.log("🚀 TransferPetOwnership Function Called!");
    console.log("🔢 Received Pet ID:", petId);
    console.log("📧 Received New Owner Email:", newOwnerEmail);
    console.log("🛠 Full Request Body:", req.body);
    console.log("🌍 Full Request Object:", req);

    if (!petId || !newOwnerEmail) {
        return res.status(400).json({ error: "Missing required fields: petId or newOwnerEmail" });
    }

    petId = parseInt(petId, 10);
    if (isNaN(petId)) {
        console.log("❌ ERROR: Invalid petId format:", petId);
        return res.status(400).json({ error: "Invalid petId format. Expected a number." });
    }

    const getUserQuery = 'SELECT user_id FROM users WHERE email = ?';

    db.query(getUserQuery, [newOwnerEmail], (err, result) => {
        if (err) {
            console.error("❌ ERROR: Failed to fetch user_id", err);
            return res.status(500).json({ error: "Database error when fetching user_id." });
        }

        if (result.length === 0) {
            console.error("❌ ERROR: User not found:", newOwnerEmail);
            return res.status(404).json({ error: "User not found." });
        }

        const newOwnerId = result[0].user_id;
        console.log("✅ New Owner ID:", newOwnerId);

        if (isNaN(newOwnerId)) {
            console.error("❌ ERROR: Invalid newOwnerId retrieved:", newOwnerId);
            return res.status(500).json({ error: "Invalid user_id retrieved from database." });
        }

        const updatePetQuery = 'UPDATE pets SET owner_id = ? WHERE pet_id = ?';

        console.log(`📝 Executing SQL: ${updatePetQuery}`);
        console.log(`🔢 Values: [${newOwnerId}, ${petId}]`);

        db.query(updatePetQuery, [newOwnerId, petId], (err, updateResult) => {
            if (err) {
                console.error("❌ ERROR: Failed to update pet ownership", err);
                return res.status(500).json({ error: err.message });
            }

            console.log("✅ MySQL Affected Rows:", updateResult.affectedRows);

            if (updateResult.affectedRows === 0) {
                console.error("❌ ERROR: No rows updated. Maybe pet_id does not exist?");
                return res.status(400).json({ error: "No pet found with the given petId." });
            }

            console.log("✅ Pet ownership transferred successfully!");
            res.status(200).json({ message: "Pet ownership transferred successfully." });
        });
    });
};
