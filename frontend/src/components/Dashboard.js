import React, { useEffect, useState } from 'react';
import api from '../api'; // Assuming you have an API handler for making requests

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            fetchUserData(token);
        } else {
            window.location.href = '/login'; // Redirect to login if not logged in
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            // Fetch user details (including premium status)
            const { data: userData } = await api.getUserDetails(token);
            setUsername(userData.name);
            setIsPremium(userData.isPremium);

            // Fetch subscriptions
            const { data: subscriptionsData } = await api.getUserSubscriptions(userData._id, token);
            setSubscriptions(subscriptionsData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        // Clear the token and username from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        // Redirect to login page
        window.location.href = '/login';
    };

    const isBasicUserMaxedOut = () => !isPremium && subscriptions.length >= 3;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome, {username}!</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div className="dashboard-content">
                {isBasicUserMaxedOut() ? (
                    <p>You have reached the maximum number of subscriptions for basic users. Upgrade to premium for unlimited subscriptions.</p>
                ) : (
                    <button onClick={() => alert('Subscribe to a new app')}>Subscribe to New App</button>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
