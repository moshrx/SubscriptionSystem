import React from 'react';
import '../styles/footer.css'; // Import the CSS file

const Footer = () => {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} Snail Mail. All rights reserved.</p>
            <p>Follow us on social media</p>
        </footer>
    );
};

export default Footer;
