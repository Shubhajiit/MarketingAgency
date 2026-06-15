const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
const { getCache, setCache, delCache } = require('../utils/redis');
const { getPresignedUrl } = require('../utils/s3');

// List all courses (Admin sees all, public only gets active)
exports.listCourses = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = {};
    
    // If not requesting all (e.g. public view), only fetch active ones
    if (all !== 'true') {
      filter.isActive = true;
    }

    // Redis cache for public listing (not for admin all=true)
    const cacheKey = all === 'true' ? null : 'courses:active:list';
    if (cacheKey) {
      const cached = await getCache(cacheKey);
      if (cached) {
        return res.status(200).json({ success: true, data: { courses: cached }, fromCache: true });
      }
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });

    if (cacheKey) {
      await setCache(cacheKey, courses, 300); // 5 minute TTL
    }

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
    await delCache('courses:active:list'); // bust cache
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
    await delCache('courses:active:list'); // bust cache
    res.status(200).json({
      success: true,
      data: { course }
    });
  } catch (error) {
    console.error('Update Course Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// Delete course (Admin only - soft delete by deactivating)
exports.deleteCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Course ID format' });
    }
    const course = await Course.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    await delCache('courses:active:list'); // bust cache
    res.status(200).json({
      success: true,
      message: 'Course deactivated successfully'
    });
  } catch (error) {
    console.error('Delete Course Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Enroll in a course — legacy free enroll (kept for compatibility)
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
    await delCache(`user:${req.user.id}:me`);

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

// GET /api/v1/courses/:id/videos
// Returns S3 pre-signed URLs for all videos in the course (enrolled users only)
exports.getCourseVideos = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid Course ID format' });
    }

    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Authorization: check user is enrolled
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const isEnrolled = user.enrolledCourses.some(
      (id) => id.toString() === courseId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Please enroll in this course to watch videos.'
      });
    }

    // Check if S3 is configured
    if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID) {
      return res.status(200).json({
        success: true,
        data: { videos: [], course: { title: course.title, _id: course._id } },
        message: 'AWS S3 not configured. No videos available yet.'
      });
    }

    // Generate pre-signed URLs for each video (15 min TTL)
    const sortedVideos = [...(course.videos || [])].sort((a, b) => a.order - b.order);
    const videosWithUrls = await Promise.all(
      sortedVideos.map(async (video) => {
        try {
          const url = await getPresignedUrl(video.s3Key, 900); // 15 minutes
          return {
            _id: video._id,
            title: video.title,
            duration: video.duration,
            description: video.description,
            order: video.order,
            url,
          };
        } catch (err) {
          console.error(`[CourseController] Failed to get presigned URL for ${video.s3Key}:`, err.message);
          return {
            _id: video._id,
            title: video.title,
            duration: video.duration,
            description: video.description,
            order: video.order,
            url: null, // video unavailable
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      data: {
        course: {
          _id: course._id,
          title: course.title,
          instructorName: course.instructorName,
          metaType: course.metaType,
        },
        videos: videosWithUrls,
      }
    });
  } catch (error) {
    console.error('Get Course Videos Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
