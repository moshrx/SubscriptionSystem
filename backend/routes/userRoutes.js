// userRoutes.js
const express = require('express');
const { getUserById } = require('../controllers/userController.js'); // Correct path

const router = express.Router();

// Route to get a user by ID
router.get('/:id', getUserById);

module.exports = router;
