import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

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
        <header className="header">
            <h1>Snail Mail</h1>

            {!isPremium && (
                <button
                    className="upgrade-button"
                    onClick={handleUpgradeClick}
                >
                    Upgrade to Premium
                </button>
            )}
        </header>
    );
};

export default Header;
