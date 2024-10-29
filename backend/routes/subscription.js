const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription.models');
const Application = require('../models/application.models');
const User = require('../models/user.models');
const { addSubscription } = require('../controllers/subscriptionController');

// Route to add a subscription
router.post('/add', addSubscription);

// GET all applications
router.get('/apps', async (req, res) => {
    try {
        //console.log("Fetching applications");
        const apps = await Application.find({}, 'appId appName'); // Fetch only appId and appName
        res.json(apps);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all subscriptions
router.get('/subscriptions', async (req, res) => {
    try {
        //console.log("Fetching subscriptions");
        const subscriptions = await Subscription.find({}, 'subscriptionId appId userId cost subscriptionDate renewalDate'); // Fetch only appId and appName
        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
