const express = require('express');
const router = express.Router();
const { razorpayWebhook, stripeWebhook } = require('../controllers/webhook.controller');

// IMPORTANT: These routes must use express.raw() — configured in app.js
// Do NOT apply express.json() to webhook routes
router.post('/razorpay', razorpayWebhook);
router.post('/stripe', stripeWebhook);

module.exports = router;
