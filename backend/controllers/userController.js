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

// Export the function
module.exports = { getUserById };