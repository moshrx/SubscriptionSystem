import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css'; // Import the CSS file

const App = () => {
    // Helper function to check if the user is logged in
    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null;
    };

    const [auth, setAuth] = useState(null); // To track authentication

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setAuth={setAuth} />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protect dashboard route */}
                <Route
                    path="/dashboard"
                    element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
                />
                
                {/* Redirect to login if accessing root path */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
