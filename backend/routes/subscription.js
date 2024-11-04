const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription.models');
const Application = require('../models/application.models');
const User = require('../models/user.models');
const Category = require('../models/category.models');
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
        const subscriptions = await Subscription.find({ userId });

        if (!subscriptions || subscriptions.length === 0) {
            return res.json({ subscriptions: [], message: 'No subscriptions found for this user' });
        }

        const appIds = subscriptions.map(sub => sub.appId);
        // Fetch application details
        const apps = await Application.find({ appId: { $in: appIds } });
        // Fetch categories for the applications
        const categories = await Category.find({ categoryId: { $in: apps.map(app => app.categoryId) } });

        // Calculate total expense, most expensive application, and latest renewal date
        let totalExpense = 0;
        let mostExpensiveApp = { appName: '', cost: 0 };
        let latestRenewalDate = new Date(0);
        let latestRenewalAppName = '';

        subscriptions.forEach(subscription => {
            const cost = Number(subscription.cost.toString());
            totalExpense += cost;

            console.log(totalExpense);
            
            const app = apps.find(a => a.appId === subscription.appId);
            if (app) {
                // Update most expensive application
                if (cost > mostExpensiveApp.cost) {
                    mostExpensiveApp = { appName: app.appName, cost };
                }

                // Update latest renewal date and associated application name
                if (new Date(subscription.renewalDate) > latestRenewalDate) {
                    latestRenewalDate = new Date(subscription.renewalDate);
                    latestRenewalAppName = app.appName;
                }
            }
         
            
        });
        console.log(latestRenewalAppName);
        console.log( latestRenewalDate );
        const responseData = {
            subscriptions,
            apps, // Include app details in the response
            categories, // Include category details in the response
            totalExpense,
            mostExpensiveApp: mostExpensiveApp.appName, // Just the name of the app
            latestRenewalDate: latestRenewalDate.toLocaleDateString(), // Format the date as needed
            latestRenewalAppName // Include the name of the app with the latest renewal date
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
