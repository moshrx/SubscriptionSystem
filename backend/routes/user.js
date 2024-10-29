const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming this is your user model

// Get user details route (returns user's premium status and other info)
router.get('/user', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming req.user is populated by the authenticate middleware
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user details like name, email, and premium status
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isPremium: user.isPremium,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
