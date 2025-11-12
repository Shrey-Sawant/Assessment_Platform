// src/api/api.js
import axios from 'axios';

const api = axios.create({
  // Backend server runs on PORT=8000 (from .env)
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Crucial for sending cookies (authToken)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token if available in local storage
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;