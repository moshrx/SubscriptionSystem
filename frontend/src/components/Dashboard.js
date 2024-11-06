import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDetails, getUserSubscriptions } from '../api';
import '../styles/styles.css';
import ChartPage from './Dashboard/ChartPage';

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
            const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
            const userData = await getUserDetails(userId, token); // Call getUserDetails directly
            setUsername(userData.name);
            setIsPremium(userData.isPremium);
            
            const subscriptionsData = await getUserSubscriptions(userId, token); // Call getUserSubscriptions directly
            setSubscriptions(subscriptionsData);

            
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                <div className="dashboard-body">
                   <ChartPage subscriptions={subscriptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
