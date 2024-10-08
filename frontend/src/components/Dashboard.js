import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Fetch the username from localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            // Redirect to login if username is not available (user not logged in)
            window.location.href = '/login';
        }
    }, []);

    const handleLogout = () => {
        // Clear the token and username from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        // Redirect to login page
        window.location.href = '/login';
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome, {username}!</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Dashboard;
