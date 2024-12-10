// src/components/PetList.js
import React, { useEffect, useState } from 'react';
import petService from '../services/petService';

const PetList = ({ onEdit }) => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchPets = async () => {
            const data = await petService.getPets();
            setPets(data);
        };
        fetchPets();
    }, []);

    const handleDelete = async (id) => {
        await petService.deletePet(id);
        setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
    };

    return (
        <ul>
            {pets.map((pet) => (
                <li key={pet.id}>
                    {pet.name} - {pet.breed} - {pet.age} years old
                    <button onClick={() => onEdit(pet)}>Edit</button>
                    <button onClick={() => handleDelete(pet.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
};

export default PetList;
