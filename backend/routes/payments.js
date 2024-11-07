// routes/payments.js
const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/paymentsController');

router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
