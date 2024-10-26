const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const subscriptionRoutes = require('./Routes/subscription');
const DBConnection = require('./config/db');
const applicationRoutes = require('./Routes/application');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
DBConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', subscriptionRoutes); // Register subscription routes
app.use('/api/applications', applicationRoutes); // This prefix should match your intended API path

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
