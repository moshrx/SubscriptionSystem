const Subscription = require('../models/subscription.models');
const Application = require('../models/application.models');
const Category = require('../models/category.models');
const client = require('../config/redisClient');
const { v4: uuidv4 } = require("uuid");

const subscriptions = async (req, res) => {
    const userId = req.query.userId;
    const cacheKey = `subscriptions:${userId}`;

    try {
        if (!userId) {
            return res.status(404).json({ message: 'Cannot load subscriptions. User not found' });
        }

        // Check Redis cache
        const cachedSubscriptions = await client.get(cacheKey);
        if (cachedSubscriptions) {
            console.log('Serving from cache');
            return res.json(JSON.parse(cachedSubscriptions));
        }

        // Fetch from database if not cached
        const subscriptions = await Subscription.find({ userId: String(userId) });

        // Cache the result in Redis with an expiry of 1 hour (3600 seconds)
        await client.setEx(cacheKey, 3600, JSON.stringify(subscriptions));

        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
};

// Add new subscription
const addSubscription = async (req, res) => {
    const { userId, appId, cost, subscriptionDate, renewalMonths, reminderEnabled, reminderDays } = req.body;
    const cacheSubKey = `subscriptions:${userId}`;
    const cacheDashKey = `dashboard:${userId}`;

    try {
        // Ensure the app exists before adding the subscription
        const app = await Application.findOne({ appId });
        if (!app) {
            return res.status(404).json({ message: 'App not found' });
        }

        // Generate a new subscription ID
        const subscriptionId = uuidv4();

        // Calculate renewal date
        const subDate = new Date(subscriptionDate);
        const renewalDate = new Date(subDate.setMonth(subDate.getMonth() + parseInt(renewalMonths, 10)));

        // Calculate reminder date if reminders are enabled and reminderDays is provided
        let reminderDate = null;
        if (reminderEnabled && reminderDays) {
            reminderDate = new Date(renewalDate);
            reminderDate.setDate(renewalDate.getDate() - parseInt(reminderDays, 10));
        }

        // Create new subscription document
        const newSubscription = new Subscription({
            subscriptionId,
            userId,  
            appId,
            cost,
            subscriptionDate,
            renewalDate,
            reminderEnabled,
            reminderDate
        });

        // Save to database
        await newSubscription.save();

        // Invalidate the cache for this user
        await client.del(cacheSubKey);
        await client.del(cacheDashKey);

        res.status(201).json({ message: 'Subscription added successfully!' });
    } catch (error) {
        console.error('Error adding subscription:', error);
        res.status(500).json({ error: 'Error adding subscription' });
    }
};

// Update subscription
const updateSubscription = async (req, res) => {
    const { subscriptionId } = req.params;
    const { cost, subscriptionDate, renewalMonths, reminderEnabled, reminderDays } = req.body;
    const cacheKey = `subscriptions:${req.body.userId}`;
    const cacheDashKey = `dashboard:${userId}`;

    try {
        const subscription = await Subscription.findOne({ subscriptionId: String(subscriptionId) });
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        // Update only the fields that are allowed
        subscription.cost = cost;
        const subDate = new Date(subscriptionDate);
        const renewalDate = new Date(subDate.setMonth(subDate.getMonth() + parseInt(renewalMonths, 10)));
        
        // Calculate reminder date if reminders are enabled and reminderDays is provided
        let reminderDate = null;
        if (reminderEnabled && reminderDays) {
            reminderDate = new Date(renewalDate);
            reminderDate.setDate(renewalDate.getDate() - parseInt(reminderDays, 10));
        }

        // Save the updated subscription
        await subscription.save();

        // Invalidate the cache for this user
        await client.del(cacheKey);
        await client.del(cacheDashKey);

        res.status(200).json({ message: 'Subscription updated successfully!' });
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ error: 'Error updating subscription' });
    }
};

//get all applications list
const getApps = async (req, res) => {
    try {
        const apps = await Application.aggregate([
            {
                $lookup: {
                    from: 'category',
                    localField: 'categoryId',
                    foreignField: 'categoryId',
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: '$categoryDetails'
            },
            {
                $project: {
                    appId: 1,
                    appName: 1,
                    categoryId: 1,
                    'categoryDetails.category': 1
                }
            },
            {
                $sort: { 'categoryDetails.category': 1, appName: 1 }
            }
        ]);
        res.json(apps);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Deactivate subscription
const deactivateSubscription = async (req, res) => {
    const { subscriptionId } = req.params;

    try {
        // Find the subscription by subscriptionId (UUID)
        const subscription = await Subscription.findOne({ subscriptionId });

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        // Deactivate the subscription by updating the required fields
        subscription.reminderDate = null;
        subscription.reminderEnabled = false;

        // Save the updated subscription
        await subscription.save();

        res.json({ message: 'Subscription deactivated successfully' });
    } catch (error) {
        console.error('Error deactivating subscription:', error);
        res.status(500).json({ message: 'Error deactivating subscription', error });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check cache first
        const cacheKey = `dashboard:${userId}`;
        const cachedDashboardData = await client.get(cacheKey);

        if (cachedDashboardData) {
            // If data is cached, return it directly
            console.log('Serving from cache');
            return res.json(JSON.parse(cachedDashboardData));
        }

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

        // Cache the response data
        await client.setEx(cacheKey, 3600, JSON.stringify(responseData));
        console.log('Data cached for user:', userId);

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { subscriptions, addSubscription, updateSubscription, getApps, deactivateSubscription, getDashboardData };


