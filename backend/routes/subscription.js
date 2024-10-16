const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Add a subscription route
router.post('/subscribe', async (req, res) => {
    const { userId, appId } = req.body;

    try {
        const user = await User.findById(userId);

        // Check if the user is premium
        if (!user.isPremium) {
            // Count current subscriptions for the user
            const subscriptionCount = await Subscription.countDocuments({ userId });

            // Restrict to 3 subscriptions for non-premium users
            if (subscriptionCount >= 3) {
                return res.status(403).json({ message: 'Basic users can only subscribe to 3 apps.' });
            }
        }

        // Proceed to create a new subscription if the user is premium or below the limit
        const newSubscription = new Subscription({
            userId,
            appId,
            cost: 0, // Adjust this logic according to your payment model
            subscriptionDate: new Date(),
            renewalDate: new Date(), // Add renewal logic if needed
        });

        await newSubscription.save();
        return res.status(201).json({ message: 'Subscription created successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
