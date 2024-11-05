import React, { useState, useEffect } from 'react';
import { getUserDetails } from '../api'; // Import getUserDetails from api.js

const Header = () => {
    const [isPremium, setIsPremium] = useState(null);
    const userId = localStorage.getItem('userId'); // Ensure userId is stored in localStorage on login
    const token = localStorage.getItem('token');   // Ensure token is stored in localStorage on login

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId || !token) {
                console.warn("User ID or token not found in localStorage.");
                return;
            }

            try {
                // Use the getUserDetails function to retrieve the user data
                const userData = await getUserDetails(userId, token);
                console.log("Fetched user data:", userData); // Debugging log
                setIsPremium(userData.isPremium);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId, token]);

    return (
        <header
            style={{
                backgroundColor: '#990011', // Dark Red
                color: '#FCF6F5', // Light Color
                padding: '1rem',
                textAlign: 'center',
                position: 'relative',
            }}
        >
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Snail Mail</h1>

            {isPremium === false && (
                <button
                    style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '1rem',
                        backgroundColor: '#FCF6F5',
                        color: '#990011',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                    onClick={() => alert('Upgrade functionality here')}
                >
                    Upgrade to Premium
                </button>
            )}
        </header>
    );
};

export default Header;
