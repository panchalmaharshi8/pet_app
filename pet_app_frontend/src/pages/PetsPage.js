// src/pages/PetsPage.js
import React, { useState } from 'react';
import PetForm from '../components/PetForm';
import PetList from '../components/PetList';

const PetsPage = () => {
    const [editingPet, setEditingPet] = useState(null);

    const handleEditPet = (pet) => {
        setEditingPet(pet);
    };

    const handleSavePet = () => {
        setEditingPet(null); // Reset form after saving
    };

    return (
        <div>
            <h1>Pets</h1>
            <PetForm pet={editingPet} onSave={handleSavePet} />
            <PetList onEdit={handleEditPet} />
        </div>
    );
};

export default PetsPage;
