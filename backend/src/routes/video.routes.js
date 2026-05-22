const express = require('express');
const router = express.Router();
const { listVideos, getVideo, getMyVideos, purchaseVideo, createVideo, updateVideo, deleteVideo } = require('../controllers/video.controller');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { cacheMiddleware } = require('../middleware/cache');

// Public routes (optionalAuth to check purchase status)
router.get('/', cacheMiddleware('video:list', 600), listVideos);
router.get('/my', authenticate, getMyVideos);
router.get('/:id', optionalAuth, getVideo);
router.post('/:id/purchase', authenticate, purchaseVideo);

// Admin routes
router.post('/', authenticate, requireRole('admin'), createVideo);
router.patch('/:id', authenticate, requireRole('admin'), updateVideo);
router.delete('/:id', authenticate, requireRole('admin'), deleteVideo);

module.exports = router;
