const Subscription = require('../models/subscription.models');
const User = require('../models/user.models');
const NotificationLog = require('../models/notificationLogs.models');
const Application = require('../models/application.models'); // Import Application model
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const cron = require('node-cron');

dotenv.config();

// Set up email transport (Nodemailer config)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send reminder emails
const sendReminderEmails = async () => {
  try {
    // Get current date
    const currentDate = new Date();

    // Find subscriptions with reminders enabled and a reminder date equal to today's date
    const subscriptions = await Subscription.find({
      reminderEnabled: true,
      reminderDate: { $eq: currentDate.toISOString().split('T')[0] }, // Compare only the date (ignoring time)
      inActive: false    });

    for (const subscription of subscriptions) {
      // Find user associated with the subscription
      const user = await User.findOne({ userId: subscription.userId });

      // Skip if user email not found
      if (!user || !user.email) continue;
      
      // Find application associated with the subscription
      const application = await Application.findOne({ appId: subscription.appId });

      // Skip if application not found
      if (!application) continue;

      // Ensure the subscription has not expired (check if renewalDate is in the future)
      const renewalDate = new Date(subscription.renewalDate);
      if (renewalDate <= currentDate) {
        console.log(`Skipping reminder for ${application.appName} as renewal date has passed.`);
        continue; // Skip if the subscription has expired
      }

      // Send reminder email
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: `Reminder: Subscription Renewal for ${application.appName}`,
        text: `Hi ${user.name},\n\nThis is a reminder that your subscription for ${application.appName} is due for renewal on ${subscription.renewalDate.toDateString()}.\n\nThank you!`,
        html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <h2 style="color: #990011;">Hello ${user.name},</h2>
                    <p>We wanted to let you know that your subscription for <strong>${application.appName}</strong> is due for renewal on <strong>${subscription.renewalDate.toDateString()}.</strong></p>
                    <p>To continue enjoying your services, please renew your subscription at your earliest convenience.</p>
                    <p>Best regards,</p>
                    <p><strong>Snail Mail Team</strong></p>
                </div>
            `
      };

      await transporter.sendMail(mailOptions);

      // Log the notification
      await NotificationLog.create({
        logId: Date.now(),
        subscriptionId: subscription.subscriptionId,
        sentAt: currentDate,
      });

      // Mark the reminder as sent
      await Subscription.findByIdAndUpdate(subscription._id, {
        reminderSent: true, // Flag to ensure the reminder is not sent again
      });

      console.log('Reminder email sent successfully for', application.appName);
    }

  } catch (error) {
    console.error('Error sending reminder emails:', error);
  }
};

// Schedule the job to run once a day at midnight (you can adjust the time as needed)
cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled task: Sending reminder emails at midnight');
    await sendReminderEmails();
});

module.exports = {
  sendReminderEmails,
};
