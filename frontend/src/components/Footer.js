import React from 'react';

const Footer = () => {
    return (
        <footer
            style={{
                backgroundColor: '#FCF6F5', // Dark Red color
                color: '#990011', // Light color for the text
                padding: '1rem',
                textAlign: 'center',
                marginTop: 'auto'  // Ensure the footer is on top of other content
            }}
        >
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} Snail Mail. All rights reserved.</p>
            <p style={{ margin: 0 }}>Follow us on social media</p>
        </footer>
    );
};

export default Footer;