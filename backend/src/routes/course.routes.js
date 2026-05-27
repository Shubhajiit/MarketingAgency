const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const courseController = require('../controllers/course.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../utils/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Public and Admin List
router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourseById);

// Admin-protected CRUD
router.post('/', protect, courseController.createCourse);
router.patch('/:id', protect, courseController.updateCourse);
router.delete('/:id', protect, courseController.deleteCourse);

// POST /api/v1/courses/upload — upload course thumbnail image to Cloudinary
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    if (cloudName && apiKey) {
      const result = await uploadToCloudinary(req.file.buffer, 'courses');
      return res.status(200).json({
        success: true,
        url: result.secure_url,
        filename: result.public_id
      });
    }

    // Fallback: Local Disk Storage
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(req.file.originalname);
    const uploadDir = path.join(__dirname, '../../public/uploads/courses');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, req.file.buffer);

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/courses/${filename}`;
    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: filename
    });
  } catch (error) {
    console.error('Course Image Upload Error:', error);
    res.status(500).json({ success: false, message: error.message || 'File upload failed' });
  }
});

module.exports = router;
