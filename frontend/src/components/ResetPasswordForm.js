import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams(); // Get token from URL
    const navigate = useNavigate(); // For redirecting after reset

    // Password validation (you can adjust this based on your requirements)
    const isValidPassword = (password) => {
        return (
            password.length >= 8 && // Minimum 8 characters
            /[A-Z]/.test(password) && // At least one uppercase letter
            /[a-z]/.test(password) && // At least one lowercase letter
            /[0-9]/.test(password) && // At least one digit
            /[^A-Za-z0-9]/.test(password) // At least one special character
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password validation
        if (!isValidPassword(password)) {
            setError(
                "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            // Send password reset request
            const response = await axios.post(`http://localhost:5000/api/auth/reset/${token}`, { password });
            setMessage(response.data.message || "Password successfully reset!");

            // Clear fields
            setPassword('');
            setConfirmPassword('');

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error("Error resetting password:", error.response.data);
            setError("Error resetting password. Please try again.");
        }
    };

    return (
        <div className="reset-password-form min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>

                {/* Display success or error messages */}
                {message && <p className="text-green-600 text-center mb-4">{message}</p>}
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">New Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
