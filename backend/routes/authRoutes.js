const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user.models');
const { register, login, forgotPassword } = require('../controllers/authController');

const router = express.Router();

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        console.log("Received Token:", token);
        console.log("Current Time:", Date.now());

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        
        console.log("User found:", user);


        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined; // Clear the token
        user.resetPasswordExpires = undefined; // Clear the expiration
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});



module.exports = router;
