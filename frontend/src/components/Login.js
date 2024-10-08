import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import api from '../api';

const Login = ({ setAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/login', { email, password });
            setAuth(data.token);
            localStorage.setItem('token', data.token); // Store token in localStorage
            localStorage.setItem('username', data.user.name); // Store username
            window.location.href = '/dashboard'; // Redirect to dashboard
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
