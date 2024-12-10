// src/components/PetForm.js
import React, { useState } from 'react';
import petService from '../services/petService';

const PetForm = ({ pet, onSave }) => {
    const [name, setName] = useState(pet ? pet.name : '');
    const [breed, setBreed] = useState(pet ? pet.breed : '');
    const [age, setAge] = useState(pet ? pet.age : '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const petData = { name, breed, age };

        if (pet) {
            await petService.updatePet(pet.id, petData);
            alert('Pet updated!');
        } else {
            await petService.createPet(petData);
            alert('Pet created!');
        }
        onSave();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
            <button type="submit">{pet ? 'Update' : 'Add'} Pet</button>
        </form>
    );
};

export default PetForm;
