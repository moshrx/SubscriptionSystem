import React, { useState, useEffect  } from 'react';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'; 
import { BiLogOut } from 'react-icons/bi'; 
import '../styles/styles.css'; 
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(true); 
  const [username, setUsername] = useState(''); // State to store username
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Handle logout functionality
  const handleLogoutClick = () => {
    // Clear the user session from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Redirect the user to the login page
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle between true/false
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />} {/* Show toggle icon */}
      </div>
      {isOpen && (
        <>
          <h2>Quick Menu</h2>
          <ul>
            <li>Dashboard</li>
            <li>Subscriptions</li>
            <li>Explore</li>
            <li>Products</li>
          </ul>
          

          {/* Profile and Logout section */}
          <div className="profile-section">
            <FaUserCircle className="profile-icon" size={40} />
            <div className="profile-details">
            <p>{username ? username : 'Guest User'}</p>
            </div>
            <button className="logout-button" onClick={handleLogoutClick}>
              <BiLogOut /> Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
