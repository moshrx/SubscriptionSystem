const Subscription = require('../models/subscription.models');
const Application = require('../models/application.models');
const { v4: uuidv4 } = require("uuid");

// Add new subscription
const addSubscription = async (req, res) => {
    const { userId, appId, cost, subscriptionDate, renewalMonths, reminderEnabled, reminderDays } = req.body;

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

        console.log(newSubscription);

        // Save to database
        await newSubscription.save();
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

    try {
        const subscription = await Subscription.findOne({ subscriptionId: String(subscriptionId) });
        console.log("Subs in controller - ",subscription);
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
        res.status(200).json({ message: 'Subscription updated successfully!' });
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ error: 'Error updating subscription' });
    }
};

module.exports = { addSubscription, updateSubscription };
