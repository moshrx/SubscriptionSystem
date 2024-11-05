const Subscription = require('../models/subscription.models');
const User = require('../models/user.models');
const NotificationLog = require('../models/notificationLogs.models');
const Application = require('../models/application.models'); // Import Application model
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

// Set up email transport (Nodemailer config)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendReminderEmails = async (req, res) => {
  try {
    // Get current date
    const currentDate = new Date();

    // Find subscriptions with reminders enabled and a reminder date within today
    const subscriptions = await Subscription.find({
      reminderEnabled: true,
      reminderDate: { $lte: currentDate },
    });

    for (const subscription of subscriptions) {
      // Find user associated with the subscription
      const user = await User.findOne({ userId: subscription.userId });

      // Skip if user email not found
      if (!user || !user.email) continue;

      console.log(subscription);
      
      // Find application associated with the subscription
      const application = await Application.findOne({ appId: subscription.appId });

      // Skip if application not found
      if (!application) continue;

      // Send reminder email
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: `Reminder: Subscription Renewal for ${application.appName}`, // Use appName instead of appId
        text: `Hi ${user.name},\n\nThis is a reminder that your subscription for ${application.appName} is due for renewal on ${subscription.renewalDate.toDateString()}.\n\nThank you!`,
      };

      await transporter.sendMail(mailOptions);

      // Log the notification
      await NotificationLog.create({
        logId: Date.now(),
        subscriptionId: subscription.subscriptionId,
        sentAt: currentDate,
      });
    }

    res.status(200).json({ message: 'Reminder emails sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending reminder emails', error });
  }
};

module.exports = {
  sendReminderEmails,
};
