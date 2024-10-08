const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

// Forgot password routes (to be implemented)
// router.post('/forgot-password', forgotPassword);

module.exports = router;
