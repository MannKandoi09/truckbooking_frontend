import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth'; // Apna backend URL

export const register = async (userData) => {
    // POST /api/auth/register [cite: 5]
    return await axios.post(`${API_BASE_URL}/register`, userData);
};

export const login = async (credentials) => {
    // POST /api/auth/login [cite: 9]
    return await axios.post(`${API_BASE_URL}/login`, credentials);
};
