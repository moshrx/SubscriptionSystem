// userRoutes.js
const express = require('express');
const { getUserById, updateUserPremiumStatus } = require('../controllers/userController.js'); 

const router = express.Router();

// Route to get a user by ID
router.get('/:id', getUserById);

router.post('/update-premium-status', updateUserPremiumStatus);

module.exports = router;
