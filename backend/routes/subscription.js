const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription.models');
const User = require('../models/user.models');
const mongoose = require('mongoose');

// Add a subscription route
router.post('/subscribe', async (req, res) => {
    const { userId, appId, cost, renewalDate, reminderDate } = req.body;

    // Debugging: Log the incoming request data
    console.log('Received Data:', { userId, appId, cost, renewalDate, reminderDate });

    // Check if userId and appId are provided
    if (!userId || !appId) {
        return res.status(400).json({ message: 'User ID and App ID are required.' });
    }

    // Optionally check if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID.' });
    }

    try {
        // Create a new subscription
        const newSubscription = await SubscriptionModel.create({
            userId,
            appId,
            cost,
            renewalDate,
            reminderDate,
        });

        // Respond with the created subscription
        res.status(201).json(newSubscription);
    } catch (error) {
        // Log any errors that occur
        console.error('Error adding subscription:', error);
        res.status(500).json({ message: 'Error adding subscription', error });
    }
});


module.exports = router;
