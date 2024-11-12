const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription.models');
const { subscriptions, addSubscription, updateSubscription, getApps, deactivateSubscription, getDashboardData } = require('../controllers/subscriptionController');

// Route to add a subscription
router.post('/add', addSubscription);

// GET all subscriptions
router.get('/subscriptions',subscriptions);

//Route to update subscription
router.put('/:subscriptionId/update', updateSubscription);

router.get('/apps', getApps);

router.put('/deactivate/:subscriptionId', deactivateSubscription);

router.get('/dashboard/:userId',getDashboardData);

//api to get subscription count to check for basic or premium user
router.get('/subscriptionCount', async (req, res) => {
    const userId = req.query.userId;
    try {
        const subscriptionCount = await Subscription.countDocuments({ userId, reminderEnabled: true, reminderDate: { $ne: null, $gt: new Date() },
        renewalDate: { $ne: null, $gt: new Date()}, });
        res.json({ subscriptionCount });
    } catch (error) {
        console.error("Error getting subscription count:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/subscriptions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const subscriptions = await Subscription.find({ userId }); // Query by userId
        if (!subscriptions || subscriptions.length === 0) {
            return res.json({ subscriptions: [], message: 'No subscriptions found for this user' });
        }
        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
