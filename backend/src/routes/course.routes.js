const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const courseController = require('../controllers/course.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../utils/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { uploadToS3 } = require('../utils/s3');

// Large file upload for videos (500MB)
const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowed = /mp4|webm|mov|avi|mkv/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = /video\//.test(file.mimetype);
    if (ext || mime) return cb(null, true);
    cb(new Error('Only video files are allowed'));
  }
});

// Public and Admin List
router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourseById);

// Admin-protected CRUD
router.post('/', protect, courseController.createCourse);
router.patch('/:id', protect, courseController.updateCourse);
router.delete('/:id', protect, courseController.deleteCourse);
router.post('/:id/enroll', protect, courseController.enrollInCourse);

// GET /api/v1/courses/:id/videos — enrolled users only, returns S3 pre-signed URLs
router.get('/:id/videos', protect, courseController.getCourseVideos);

// POST /api/v1/courses/:id/upload-video — admin: upload a video to S3
router.post('/:id/upload-video', protect, videoUpload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file uploaded' });
    }

    const courseId = req.params.id;
    const ext = path.extname(req.file.originalname).toLowerCase() || '.mp4';
    const s3Key = `courses/${courseId}/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    await uploadToS3(req.file.buffer, s3Key, req.file.mimetype || 'video/mp4');

    res.status(200).json({
      success: true,
      s3Key,
      message: 'Video uploaded to S3 successfully',
    });
  } catch (error) {
    console.error('Course Video Upload Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Video upload failed' });
  }
});

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
