const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const workshopController = require('../controllers/workshop.controller');
const { protect } = require('../middlewares/auth.middleware');

// Admin stats
router.get('/stats', protect, adminController.getStats);

// Admin: list ALL workshops (including inactive ones)
router.get('/workshops', protect, workshopController.adminListWorkshops);

module.exports = router;
