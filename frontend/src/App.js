import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css'; // Import the CSS file
import ForgotPassword from './components/ForgotPassword';
import ResetPasswordForm from './components/ResetPasswordForm';

const App = () => {
    const [auth, setAuth] = useState(null); // To track authentication

    useEffect(() => {
        const token = localStorage.getItem('token');
        setAuth(token);
    }, []);

    const isAuthenticated = () => {
        return auth !== null;
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setAuth={setAuth} />} />
                <Route path="/register" element={<Register />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password/:token' element={<ResetPasswordForm />} />
                
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
