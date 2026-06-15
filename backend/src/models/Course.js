const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: 'popular'
  },
  instructorName: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  discount: {
    type: String,
    default: '0%'
  },
  mentorPicture: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Metadata fields for course details page banner
  metaType: {
    type: String,
    default: 'Professional Certification'
  },
  metaTypeSubtitle: {
    type: String,
    default: 'Learn, practice, and apply job-ready skills with expert guidance'
  },
  metaRating: {
    type: String,
    default: '4.8'
  },
  metaReviewsCount: {
    type: String,
    default: '3,150'
  },
  metaLevel: {
    type: String,
    default: 'Intermediate level'
  },
  metaLevelSubtitle: {
    type: String,
    default: 'Recommended experience'
  },
  metaDuration: {
    type: String,
    default: '23'
  },
  metaDurationSubtitle: {
    type: String,
    default: 'Learn at your own pace'
  },
  metaHandsOn: {
    type: String,
    default: 'Hands-on learning'
  },
  metaHandsOnSubtitle: {
    type: String,
    default: 'Learn more'
  },

  // Thumbnail URL (Cloudinary or S3)
  thumbnailUrl: {
    type: String,
    default: ''
  },

  // Course videos stored in AWS S3 (private bucket)
  // Each video has a title, S3 key (path in bucket), order, and optional duration
  videos: [
    {
      title: { type: String, required: true },
      s3Key: { type: String, required: true },  // e.g. "courses/course-id/intro.mp4"
      order: { type: Number, default: 0 },
      duration: { type: String, default: '' },  // e.g. "12:34"
      description: { type: String, default: '' },
    }
  ],
  whatYouWillLearn: {
    type: [String],
    default: []
  },
  skillsYouWillPractice: {
    type: [String],
    default: []
  },
  toolsYouWillUse: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  learnStepByStep: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
