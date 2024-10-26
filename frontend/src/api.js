import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/auth', // For authentication-related requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Separate instance for applications
const appApi = axios.create({
    baseURL: 'http://localhost:5000/api/applications', // For application-related requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to fetch user subscriptions
export const getUserSubscriptions = async (userId, token) => {
    const response = await api.get(`/subscriptions/${userId}/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Function to fetch applications
export const getApplications = async () => {
    const response = await appApi.get('/'); // Fetch all applications
    return response.data;
};

export default api;
