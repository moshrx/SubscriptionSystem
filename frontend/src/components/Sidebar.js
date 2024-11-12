import React, { useState, useEffect } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { Drawer, IconButton, List, ListItem, ListItemText, Divider, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'; // Import external CSS

const Sidebar = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false); // Drawer state
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
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Handle navigation menu clicks
  const handleMenuClick = (page) => {
    switch (page) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'subscriptions':
        navigate('/subscriptions');
        break;
      case 'explore':
        navigate('/explore');
        break;
      case 'Contact Us':
        navigate('/contact-us');
        break;
      default:
        break;
    }
  };

  // Toggle Drawer
  const toggleDrawer = (open) => {
    setIsOpen(open);
  };

  return (
    <div>
      {/* Toggle button for opening Drawer */}
      <IconButton className="toggle-btn" onClick={() => toggleDrawer(true)}>
        <FaBars size={24} />
      </IconButton>

      {/* Drawer component */}
      <Drawer anchor="left" open={isOpen} onClose={() => toggleDrawer(false)}>
        <Box className="drawer-box" role="presentation" onClick={() => toggleDrawer(false)} onKeyDown={() => toggleDrawer(false)}>
          <Typography variant="h6" className="drawer-title">Quick Menu</Typography>
          <Divider />

          <List>
            <ListItem button onClick={() => handleMenuClick('dashboard')} className="drawer-item">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleMenuClick('subscriptions')} className="drawer-item">
              <ListItemText primary="Subscriptions" />
            </ListItem>
            <ListItem button onClick={() => handleMenuClick('explore')} className="drawer-item">
              <ListItemText primary="Explore" />
            </ListItem>
            <ListItem button onClick={() => handleMenuClick('Contact Us')} className="drawer-item">
              <ListItemText primary="Contact Us" />
            </ListItem>
          </List>

          <Divider />

          {/* Profile and Logout section */}
          <Box className="profile-section">
            <FaUserCircle size={40} />
            <Typography variant="body1" className="profile-username">
              {username ? username : 'Guest User'}
            </Typography>
            <IconButton onClick={handleLogoutClick} className="logout-button">
              <BiLogOut /> <Typography className="logout-text">Logout</Typography>
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default Sidebar;
