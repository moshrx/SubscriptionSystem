const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription.models');
const Application = require('../models/application.models');
const User = require('../models/user.models');
const Category = require('../models/category.models');
const { addSubscription, updateSubscription, deactivateSubscription } = require('../controllers/subscriptionController');

// Route to add a subscription
router.post('/add', addSubscription);

// Route to update a subscription
router.put('/:subscriptionId/update', async (req, res) => {
    const { subscriptionId } = req.params;
    const updatedData = req.body;
    try {
        const subData = await Subscription.findOne({ subscriptionId: String(subscriptionId) });
        const updatedSubscription = await Subscription.findOneAndUpdate({ subscriptionId: String(subscriptionId) }, updatedData, {new : true});
        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json(updatedSubscription);
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


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
    const userId = req.query.userId;
    try {
const subscriptions = await Subscription.find({
    userId,
    reminderDate: { $ne: null, $gt: new Date() },
    renewalDate: { $ne: null, $gt: new Date()},
    reminderEnabled: true  // reminderEnabled is true

});
        
        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

router.put('/deactivate/:subscriptionId', deactivateSubscription);

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

router.get('/dashboard/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find subscriptions for the user
        const subscriptions = await Subscription.find({ userId, reminderEnabled: true,  reminderDate: { $ne: null, $gt: new Date() },
        renewalDate: { $ne: null, $gt: new Date()}, });

        if (!subscriptions || subscriptions.length === 0) {
            return res.json({ subscriptions: [], message: 'No subscriptions found for this user' });
        }

        const appIds = subscriptions.map(sub => sub.appId);
        // Fetch application details
        const apps = await Application.find({ appId: { $in: appIds } });
        // Fetch categories for the applications
        const categories = await Category.find({ categoryId: { $in: apps.map(app => app.categoryId) } });

        // Calculate total expense, most expensive application, and upcoming renewal date
        let totalExpense = 0;
        let mostExpensiveApp = { appName: '', cost: 0 };
        let upcomingRenewalDate = null;
        let upcomingRenewalAppName = '';

        const today = new Date();

        subscriptions.forEach(subscription => {
            const cost = Number(subscription.cost.toString());
            totalExpense += cost;

            const app = apps.find(a => a.appId === subscription.appId);
            if (app) {
                // Update most expensive application
                if (cost > mostExpensiveApp.cost) {
                    mostExpensiveApp = { appName: app.appName, cost };
                }

                const renewalDate = new Date(subscription.renewalDate);

                // Update upcoming renewal date and associated application name
                if (renewalDate > today && (!upcomingRenewalDate || renewalDate < upcomingRenewalDate)) {
                    upcomingRenewalDate = renewalDate;
                    upcomingRenewalAppName = app.appName;
                }
            }
        });

        const responseData = {
            subscriptions,
            apps, // Include app details in the response
            categories, // Include category details in the response
            totalExpense,
            mostExpensiveApp: mostExpensiveApp.appName, // Just the name of the app
            upcomingRenewalDate: upcomingRenewalDate ? upcomingRenewalDate.toLocaleDateString() : 'No upcoming renewal date', // Format the date as needed
            upcomingRenewalAppName // Include the name of the app with the closest upcoming renewal date
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router;
