const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshop.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../utils/upload');

// ─── Public Routes (no auth required) ───────────────────────
// GET /api/v1/workshops          — list all active workshops
// GET /api/v1/workshops/:slug    — get workshop by slug
router.get('/', workshopController.listWorkshops);
router.get('/:slug', workshopController.getWorkshopBySlug);

// ─── Admin Routes (auth required) ───────────────────────────
// POST   /api/v1/workshops              — create workshop
// PATCH  /api/v1/workshops/:id          — update workshop
// DELETE /api/v1/workshops/:id          — soft-delete workshop
// GET    /api/v1/workshops/admin/all    — list all (incl. inactive)
router.post('/', protect, workshopController.createWorkshop);
router.patch('/:id', protect, workshopController.updateWorkshop);
router.delete('/:id', protect, workshopController.deleteWorkshop);
router.post('/:id/cancel', protect, workshopController.cancelWorkshop);
router.post('/:id/register', protect, workshopController.registerForWorkshop);

const fs = require('fs');
const path = require('path');
const { uploadToCloudinary } = require('../utils/cloudinary');

// POST   /api/v1/workshops/upload       — upload image (returns Cloudinary or Local URL)
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    if (cloudName && apiKey) {
      const result = await uploadToCloudinary(req.file.buffer);
      return res.status(200).json({
        success: true,
        url: result.secure_url,
        filename: result.public_id
      });
    }

    // Fallback: Local Disk Storage
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(req.file.originalname);
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, req.file.buffer);

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: filename
    });
  } catch (error) {
    console.error('File Upload Error:', error);
    res.status(500).json({ success: false, message: error.message || 'File upload failed' });
  }
});

// Brochure file upload (10MB limit, PDF/Word files)
const multer = require('multer');
const brochureUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|doc|docx/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = /pdf|msword|officedocument/.test(file.mimetype);
    if (ext || mime) return cb(null, true);
    cb(new Error('Only PDF or Word documents are allowed'));
  }
});
const { uploadToS3, getPresignedUrl } = require('../utils/s3');

// POST /api/v1/workshops/upload-brochure — admin: upload brochure to S3
router.post('/upload-brochure', protect, brochureUpload.single('brochure'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No brochure file uploaded' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase() || '.pdf';
    const s3Key = `workshops/brochures/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    await uploadToS3(req.file.buffer, s3Key, req.file.mimetype || 'application/pdf');

    const url = await getPresignedUrl(s3Key, 3600); // 1 hour expiration

    res.status(200).json({
      success: true,
      s3Key,
      url,
      message: 'Brochure uploaded to S3 successfully',
    });
  } catch (error) {
    console.error('Workshop Brochure Upload Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Brochure upload failed' });
  }
});

module.exports = router;
