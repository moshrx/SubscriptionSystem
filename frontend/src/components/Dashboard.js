import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import Sidebar from './Sidebar';
import '../styles/styles.css';

const Dashboard = ({ userName }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, redirecting to login.');
            navigate('/login');
        } else {
            const storedUsername = localStorage.getItem('username');
            setUser(storedUsername || 'User');
            fetchUserData(token); 
        }
    }, [navigate]);

    const fetchUserData = async (token) => {
        try {
            const { data: userData } = await api.getUserDetails(token);
            setUsername(userData.name);
            setIsPremium(userData.isPremium);
            const { data: subscriptionsData } = await api.getUserSubscriptions(userData._id, token);
            setSubscriptions(subscriptionsData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isBasicUserMaxedOut = () => !isPremium && subscriptions.length >= 3;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-container">
            <Sidebar />
                <div className="dashboard-body">
                    <h1>Welcome, {username}!</h1>
                    {/* Add content here */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
