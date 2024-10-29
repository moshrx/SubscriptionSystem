import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import api from '../api';
import { useNavigate } from 'react-router-dom';
import snailImage from '../assets/snail.png';

const Login = ({ setAuth }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Track login errors
    const [emailError, setEmailError] = useState(''); // For email field validation
    const [passwordError, setPasswordError] = useState(''); // For password field validation

    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;

        // Email validation
        if (email.trim() === '') {
            setEmailError('Email is required');
            valid = false;
        } else {
            setEmailError('');
        }

        // Password validation
        if (password.trim() === '') {
            setPasswordError('Password is required');
            valid = false;
        } else {
            setPasswordError('');
        }

        // Only proceed if both fields are filled
        if (!valid) return;

        try {
            const { data } = await api.post('/login', { email, password });
            setAuth(data.token);
            localStorage.setItem('token', data.token); // Store token in localStorage
            localStorage.setItem('username', data.user.name); // Store username
            localStorage.setItem('userId', data.user.userId); // Store userId for later use
            navigate('/dashboard'); // Redirect to dashboard
        } catch (err) {
            console.error(err);
            setError('Invalid credentials'); // Set error for invalid login attempt
        }
    };

    return (

        <div className="flex h-screen">
            {/* Left section for image */}
            <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                <img 
                    src={snailImage} 
                    alt="Login" 
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Right section for the login form */}
            <div className="w-1/2 flex justify-center items-center h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className={`w-full p-3 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className={`w-full p-3 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                        >
                            Login
                        </button>
                    </form>
                    <p className="text-center mt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Register here
                        </Link>
                    </p>

                    {error && (
                        <p className="text-center text-red-500 mt-4">
                            {error}
                            <br />
                            <Link to="/forgot-password" className="text-blue-500 hover:underline">
                                Reset your password here
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
