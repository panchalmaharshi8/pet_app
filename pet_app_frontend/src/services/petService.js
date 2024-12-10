// src/services/petService.js
import axios from 'axios';
import API_URL from '../config';

const getPets = async () => {
    const response = await axios.get(`${API_URL}/pets`);
    return response.data;
};

const createPet = async (petData) => {
    const response = await axios.post(`${API_URL}/pets`, petData);
    return response.data;
};

const updatePet = async (id, petData) => {
    const response = await axios.put(`${API_URL}/pets/${id}`, petData);
    return response.data;
};

const deletePet = async (id) => {
    const response = await axios.delete(`${API_URL}/pets/${id}`);
    return response.data;
};

export default { getPets, createPet, updatePet, deletePet };
