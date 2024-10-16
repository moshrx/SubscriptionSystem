import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/auth', // This should point to the backend server URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
