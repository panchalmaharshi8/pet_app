// src/services/api.js
import axios from 'axios';
import API_URL from '../config';

const api = axios.create({
    baseURL: API_URL//'http://localhost:3000'
});

// Automatically include token in headers
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
