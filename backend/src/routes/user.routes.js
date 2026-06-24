const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/me', protect, userController.getMe);
router.patch('/me', protect, userController.updateProfile);
router.delete('/me/workshops/:workshopId', protect, userController.removeWorkshop);
router.get('/me/purchase-history', protect, userController.getPurchaseHistory);

module.exports = router;
