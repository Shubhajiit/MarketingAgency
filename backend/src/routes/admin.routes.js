const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/stats', protect, adminController.getStats);

module.exports = router;
