const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['popular', 'pro-specialist', 'short', 'advanced'],
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
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
