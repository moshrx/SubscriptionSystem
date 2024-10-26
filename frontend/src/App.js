import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Subscription from './components/Subscription';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ForgotPassword from './components/ForgotPassword';
import ResetPasswordForm from './components/ResetPasswordForm';
import AddSubscriptionForm from './components/AddSubscriptionForm';
import './App.css';

const AppContent = () => {
    const [auth, setAuth] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setAuth(token);
    }, []);

    const isAuthenticated = () => {
        return auth !== null;
    };

    const shouldShowSidebar = !['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

    return (
        <>
            {isAuthenticated() && shouldShowSidebar && <Header />}
            
            <div className="app-layout">
                {isAuthenticated() && shouldShowSidebar && <Sidebar />}
                
                <div className="main-content">
                    <Routes>
                        <Route path="/login" element={<Login setAuth={setAuth} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path='/forgot-password' element={<ForgotPassword />} />
                        <Route path='/reset-password/:token' element={<ResetPasswordForm />} />

                        <Route
                            path="/dashboard"
                            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/subscriptions"
                            element={isAuthenticated() ? <Subscription /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/add-subscription"
                            element={isAuthenticated() ? <AddSubscriptionForm /> : <Navigate to="/login" />}
                        />

                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            </div>

            {isAuthenticated() && shouldShowSidebar && <Footer />}
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
