import axios from 'axios';

// URL de base = ton backend Laravel
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true, // ESSENTIEL pour les cookies/sessions
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Intercepteur pour le debug
api.interceptors.request.use(
    config => {
        console.log(`➡️ Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => {
        console.log(`⬅️ Response: ${response.status} ${response.statusText}`);
        return response;
    },
    error => {
        console.error('❌ Axios Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default api;