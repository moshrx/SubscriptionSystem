// controller/paymentsController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const Payment = require('../models/payment.models');
const User = require('../models/user.models');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const dotenv = require("dotenv");

dotenv.config();

const createPaymentIntent = async (req, res) => {
    const { userId, duration, totalAmount } = req.body;

    try {

        const user = await User.findOne({userId: userId});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create the payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'cad',
            metadata: { userId, duration },
        });

        const totalAmountPaid = mongoose.Types.Decimal128.fromString((paymentIntent.amount / 100).toString())
        // Prepare payment data
        const paymentData = {
            paymentId: paymentIntent.id,
            userId: userId,
            amountPaid: totalAmountPaid, // Convert cents to dollars
            paymentDate: new Date(paymentIntent.created * 1000), // Stripe timestamp is in seconds
            transactionId: uuidv4()
        };

        // Save payment data to database
        const payment = new Payment(paymentData);
        await payment.save();

        console.log('Payment saved successfully:', payment);

        const userEmail = user.email;
        const name = user.name;

        // Calculate renewal date
        const renewalDate = new Date();
        renewalDate.setMonth(renewalDate.getMonth() + duration);

        // Send welcome email
        await sendWelcomeEmail(name, userEmail, duration, renewalDate, totalAmountPaid);
        console.log('Reminder emails sent successfully');

        // Respond with client secret
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Payment unsuccessful. Please try Again!' });
    }
};

const sendWelcomeEmail = async (name, userEmail, duration, renewalDate, totalAmountPaid) => {
    try {
        // Configure the SMTP transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS, 
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: userEmail,
            subject: 'Welcome to Premium Services!',
            html: `
                <h1>Welcome to Premium Services Of Subscription Management System !</h1>
                <p>Hi ${name},</p>
                <p>Thank you for subscribing to our Premium Services. We are excited to have you on board!</p>
                <p><strong>Subscription Duration:</strong> ${duration} months</p>
                <p><strong>Renewal Date:</strong> ${renewalDate.toDateString()}</p>
                <p><strong>Amount Paid:</strong> ${totalAmountPaid}</p>
                <p>Enjoy our premium features, and feel free to reach out if you have any questions.</p>
                <p>Best regards,<br>SnailMail</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};


module.exports = { createPaymentIntent, sendWelcomeEmail };