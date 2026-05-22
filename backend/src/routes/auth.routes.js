const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, forgotPassword, resetPassword, googleLogin } = require('../controllers/auth.controller');
const { rateLimiter } = require('../middleware/rateLimiter');

// Rate limit auth endpoints more strictly
const authLimiter = rateLimiter({ windowMs: 60000, max: 10, prefix: 'auth-rate' });

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

module.exports = router;
