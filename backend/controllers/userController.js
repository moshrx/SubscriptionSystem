const User = require('../models/user.models.js'); // Adjust path as necessary

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
            },
            { new: true }
        );
        res.status(200).json({ message: 'User status updated successfully.' });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Failed to update user status.' });
    }
};

// Export the function
module.exports = { getUserById, updateUserPremiumStatus };