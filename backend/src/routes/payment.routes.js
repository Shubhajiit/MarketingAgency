const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth');

router.post('/create-order', authenticate, createOrder);

module.exports = router;
