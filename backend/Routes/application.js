// routes/application.js
const express = require('express');
const router = express.Router();
const { getApplications } = require('../controllers/applicationController');

// Route to fetch all applications
router.get('/', getApplications);

module.exports = router;
