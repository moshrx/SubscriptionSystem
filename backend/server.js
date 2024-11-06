const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const SubscriptionRoute = require('./routes/subscription');
const paymentsRouter = require('./routes/payments');
const DBConnection = require('./config/db');
const reminderRoute = require('./routes/reminderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
DBConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscription', SubscriptionRoute);
app.use('/api/payments', paymentsRouter);
app.use('/api/reminders', reminderRoute);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
