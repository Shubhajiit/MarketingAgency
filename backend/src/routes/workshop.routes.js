const express = require('express');
const router = express.Router();
const { listWorkshops, getWorkshop, createWorkshop, updateWorkshop, deleteWorkshop } = require('../controllers/workshop.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { cacheMiddleware } = require('../middleware/cache');

// Public routes
router.get('/', cacheMiddleware('workshop:list', 300), listWorkshops);
router.get('/:id', cacheMiddleware('workshop', 600, (req) => req.params.id), getWorkshop);

// Admin routes
router.post('/', authenticate, requireRole('admin'), createWorkshop);
router.patch('/:id', authenticate, requireRole('admin'), updateWorkshop);
router.delete('/:id', authenticate, requireRole('admin'), deleteWorkshop);

module.exports = router;
