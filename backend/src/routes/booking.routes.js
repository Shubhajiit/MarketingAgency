const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBooking } = require('../controllers/booking.controller');
const { authenticate } = require('../middleware/auth');

// All booking routes require authentication
router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getMyBookings);
router.get('/:id', authenticate, getBooking);

module.exports = router;
