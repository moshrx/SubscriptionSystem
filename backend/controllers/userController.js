const User = require('../models/user.models.js'); 
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const cron = require('node-cron');


// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
  });

// Define the getUserById function
const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserPremiumStatus = async (req, res) => {
    const { userId, isPremium, subscriptionDate, renewalDate } = req.body;
    try {
        await User.findOneAndUpdate(
            { userId },
            {
                isPremium,
                subscriptionDate,
                renewalDate,
                updatedAt: new Date(),
                emailSentOnExpiration : false,
            },
            { new: true }
        );
        res.status(200).json({ message: 'User status updated successfully.' });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Failed to update user status.' });
    }
};

  
cron.schedule('*/2 * * * *', async () => {
    console.log('Running daily subscription reminder check...');

    const today = new Date();

    try {
        // Find users who are currently premium and have a renewalDate
        const premiumUsers = await User.find({
            isPremium: true,
            renewalDate: { $exists: true },
        });

        for (const user of premiumUsers) {
            if (!user.renewalDate) continue; // Skip users without a renewal date

            // Calculate days until renewal
            const daysUntilRenewal = Math.ceil((user.renewalDate - today) / (1000 * 60 * 60 * 24));

            // Check if the renewal date is 15 or 7 days away, and email hasn't been sent for that reminder
            if (daysUntilRenewal === 15 && !user.emailSent15DaysBefore) {
                // Send 15-day reminder email
                await transporter.sendMail({
                    from: process.env.EMAIL_ADDRESS,
                    to: user.email,
                    subject: 'Subscription Expiration Reminder - 15 Days Left',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                            <h2 style="color: #990011;">Hello ${user.name},</h2>
                            <p>Your <strong>premium subscription</strong> for the <strong>Subscription Management System</strong> will expire in 15 days.</p>
                            <p>To continue enjoying premium services, please renew your subscription before it expires.</p>
                            <p style="color: #990011;"><strong>Thank you for being with us!</strong></p>
                            <p>Best regards,</p>
                            <p><strong>Snail Mail Team</strong></p>
                        </div>
                    `
                });

                console.log(`15-day expiration reminder sent to ${user.email}`);
                user.emailSent15DaysBefore = true;
                await user.save();
            } else if (daysUntilRenewal === 7 && !user.emailSent7DaysBefore) {
                // Send 7-day reminder email
                await transporter.sendMail({
                    from: process.env.EMAIL_ADDRESS,
                    to: user.email,
                    subject: 'Subscription Expiration Reminder - 7 Days Left',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                            <h2 style="color: #990011;">Hello ${user.name},</h2>
                            <p>Your <strong>premium subscription</strong> for the <strong>Subscription Management System</strong> will expire in 7 days.</p>
                            <p>To continue enjoying premium services, please renew your subscription before it expires.</p>
                            <p style="color: #990011;"><strong>Thank you for being with us!</strong></p>
                            <p>Best regards,</p>
                            <p><strong>Snail Mail Team</strong></p>
                        </div>
                    `
                });

                console.log(`7-day expiration reminder sent to ${user.email}`);
                user.emailSent7DaysBefore = true;
                await user.save();
            }
        }
    } catch (error) {
        console.error('Error in subscription reminder cron job:', error);
    }
});
// Export the function
module.exports = { getUserById, updateUserPremiumStatus };