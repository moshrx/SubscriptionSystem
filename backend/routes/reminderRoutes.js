
const express = require('express');
const router = express.Router();
const { sendReminderEmails } = require('../controllers/reminderController'); 

// Define the POST route with a callback function
router.post('/send-reminders', sendReminderEmails); // Ensure sendReminderEmails is a function, not an object

module.exports = router;

