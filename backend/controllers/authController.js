const User = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config(); 

// Registration controller
const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10), // Hash the password
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Send token and user details in response
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token; // Ensure this line is present
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
        await user.save();

        console.log('Generated reset token:', token);
        console.log('Email sent to:', user.email);

        // Set up Nodemailer with your credentials
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS, 
                pass: process.env.EMAIL_PASSWORD
            },
        });

        console.log(process.env.EMAIL_ADDRESS);
        
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_ADDRESS,
            subject: 'Password Reset',
            text: `You are receiving this because you requested to reset your password. Please click on the link below or paste it into your browser: \n\n http://localhost:3000/reset-password/${token} \n\n If you did not request this, please ignore this email.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to email' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Error sending reset email' });
    }
};

module.exports = { register, login, forgotPassword };