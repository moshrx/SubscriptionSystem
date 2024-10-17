import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState('');

    useEffect(() => {
        // Check if the token exists in localStorage
        const token = localStorage.getItem('token');
        console.log("token----------",token);
        if (!token) {
            // If no token is found, redirect to login
            console.log('No token found, redirecting to login.');
            navigate('/login');
        } else {
            const username = localStorage.getItem('username'); // Retrieve the stored username
            setUser(username || 'User');
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded shadow-md w-96 text-center">
                <h1 className="text-3xl font-bold mb-6">Welcome, {user}!</h1>
                <p className="text-gray-600">You have successfully logged in to your dashboard.</p>
                <button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded mt-4"
                    onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
