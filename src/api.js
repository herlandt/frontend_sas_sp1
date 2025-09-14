// src/api.js

import axios from 'axios';

// Creamos una instancia de axios con configuración base
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // La URL base de tu API
});

// Esto es un "interceptor": se ejecuta ANTES de cada petición.
// Su trabajo es tomar el token del localStorage y añadirlo a los encabezados.
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;