import React from 'react';

const Header = () => {
    return (
        <header
            style={{
                backgroundColor: '#990011', // Dark Red
                color: '#FCF6F5', // Light Color
                padding: '1rem',
                textAlign: 'center',
            }}
        >
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Snail Mail</h1>
        </header>
    );
};

export default Header;