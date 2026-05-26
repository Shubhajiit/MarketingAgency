const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public and Admin List
router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourseById);

// Admin-protected CRUD
router.post('/', protect, courseController.createCourse);
router.patch('/:id', protect, courseController.updateCourse);
router.delete('/:id', protect, courseController.deleteCourse);

module.exports = router;
