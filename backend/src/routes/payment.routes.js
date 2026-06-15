const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');

// All payment routes require authentication
router.post('/create-order', protect, paymentController.createOrder);
router.post('/verify', protect, paymentController.verifyPayment);
router.post('/failed', protect, paymentController.markFailed);

// Course payment routes
router.post('/course/create-order', protect, paymentController.createCourseOrder);
router.post('/course/verify', protect, paymentController.verifyCoursePayment);
router.post('/course/failed', protect, paymentController.markCoursePaymentFailed);

module.exports = router;
