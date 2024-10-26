// controllers/applicationController.js
const ApplicationModel = require('../models/application.models');

// Fetch all applications
exports.getApplications = async (req, res) => {
    console.log('Fetching applications...');
    try {
        const applications = await ApplicationModel.find();
        console.log('Applications found:', applications);
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
