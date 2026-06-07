const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

// List all courses (Admin sees all, public only gets active)
exports.listCourses = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = {};
    
    // If not requesting all (e.g. public view), only fetch active ones
    if (all !== 'true') {
      filter.isActive = true;
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: { courses }
    });
  } catch (error) {
    console.error('List Courses Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Course ID format' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: { course } });
  } catch (error) {
    console.error('Get Course Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Create new course (Admin only)
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({
      success: true,
      data: { course }
    });
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// Update existing course (Admin only)
exports.updateCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Course ID format' });
    }
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({
      success: true,
      data: { course }
    });
  } catch (error) {
    console.error('Update Course Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// Delete course (Admin only - soft delete by deactivating or hard delete. Let's do soft delete first)
exports.deleteCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Course ID format' });
    }
    const course = await Course.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Course deactivated successfully'
    });
  } catch (error) {
    console.error('Delete Course Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Enroll in a course (Purchase)
exports.enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid Course ID format' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.enrolledCourses.some(id => id.toString() === courseId.toString())) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Enrolled in course successfully',
      data: {
        enrolledCourses: user.enrolledCourses
      }
    });
  } catch (error) {
    console.error('Enroll Course Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
