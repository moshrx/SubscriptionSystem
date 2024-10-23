import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/auth', // Update with your actual backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUserSubscriptions = async (userId, token) => {
    const response = await api.get(`/subscriptions/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export default api;
