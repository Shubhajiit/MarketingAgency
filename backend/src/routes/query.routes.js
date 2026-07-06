const express = require('express');
const router = express.Router();
const queryController = require('../controllers/query.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public route to submit a query
router.post('/', queryController.submitQuery);

// Admin routes: get all and delete specific queries
router.get('/', protect, queryController.getAllQueries);
router.delete('/:id', protect, queryController.deleteQuery);

module.exports = router;
