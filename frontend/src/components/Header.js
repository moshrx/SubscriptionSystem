import React, { useState, useEffect } from 'react';
import { getUserDetails } from '../api';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [isPremium, setIsPremium] = useState(localStorage.getItem('isPremiumUser') === 'true');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        
        const handleStorageChange = () => {
            setIsPremium(localStorage.getItem("isPremiumUser") === "true");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [userId, token]);

    const handleUpgradeClick = () => {
        navigate('/payments');
    };

    return (
        <header
            style={{
                backgroundColor: '#990011',
                color: '#FCF6F5',
                padding: '1rem',
                textAlign: 'center',
                position: 'relative',
            }}
        >
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Snail Mail</h1>

            {!isPremium && (
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
                    onClick={handleUpgradeClick}
                >
                    Upgrade to Premium
                </button>
            )}
        </header>
    );
};

export default Header;
