const express = require('express');
const router = express.Router();
const { getStats, getAllBookings, getAllUsers } = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { cacheMiddleware } = require('../middleware/cache');

// All admin routes require auth + admin role
router.use(authenticate, requireRole('admin'));

router.get('/stats', cacheMiddleware('admin:stats', 60), getStats);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);

module.exports = router;
