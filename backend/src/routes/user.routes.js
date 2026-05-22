const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');

router.get('/me', authenticate, getProfile);
router.patch('/me', authenticate, updateProfile);

module.exports = router;
