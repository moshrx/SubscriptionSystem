import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/auth', // Update with your actual backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUserDetails = async (userId, token) => {
    const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getUserSubscriptions = async (userId, token) => {
    const response = await api.get(`../subscription/subscriptions/${userId}`, { // Using a relative path to access the subscription endpoint
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getDashboardDetails = async (userId, token) => {
    const response = await axios.get(`http://localhost:5000/api/subscription/dashboard/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default api;
