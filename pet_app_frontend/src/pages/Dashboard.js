// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const response = await api.get('/documents', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDocuments(response.data); // Store data in state
        } catch (error) {
            console.error("Error fetching documents:", error.response ? error.response.data : error.message);
            if (error.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                navigate('/login'); // Redirect to login if unauthorized
            }
        }
    };
    

    useEffect(() => {
        fetchData(); // Call fetchData on component mount
    }, []);

    return (
        <div>
            <h2>Your Documents</h2>
            <ul>
                {documents.map((doc) => (
                    <li key={doc.documentId}>{doc.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
