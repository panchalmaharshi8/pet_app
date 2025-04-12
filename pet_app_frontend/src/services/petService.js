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

const transferPetOwnership = async (petId, newOwnerEmail) => {
    const token = localStorage.getItem('token');
    const apiUrl = `${API_URL}/pets/change-owner`;
    // const apiUrl = `${API_URL}/pets/transfer`;

    console.log("🚀 API Request Being Sent:");
    console.log("🔗 URL:", apiUrl);
    console.log("📦 Request Body:", { petId, newOwnerEmail });
    console.log("🔑 Token:", token);

    try {
        const response = await axios.put(apiUrl, 
            { petId: parseInt(petId, 10), newOwnerEmail },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log("✅ Transfer Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Transfer Failed:", error.response?.data || error.message);
    }
};


// const transferPetOwnership = async (petId, newOwnerEmail) => {
//     const token = localStorage.getItem('token');
//     console.log("🔑 Sending Token for Transfer:", token);

//     const response = await axios.put(`${API_URL}/pets/transfer`,
//         { petId: parseInt(petId, 10), newOwnerEmail },
//         {
//             headers: { Authorization: `Bearer ${token}` }
//         }
//     );

//     console.log("✅ Transfer Success:", response.data);
//     return response.data;
// };


export default { getPets, createPet, updatePet, deletePet, transferPetOwnership };

