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
  tag: {
    type: String,
    default: ''
  },
  hours: {
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
  bgGradient: {
    type: String,
    default: 'from-[#6366f1] to-[#4f46e5]'
  },
  circlesColor: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  isGraphicOnly: {
    type: Boolean,
    default: false
  },
  graphicType: {
    type: String,
    enum: ['ai', 'seo', 'ppc', 'strategy', ''],
    default: ''
  },
  primaryCtaText: {
    type: String,
    enum: ['Download Brochure', 'View Course'],
    default: 'Download Brochure'
  },
  secondaryCtaText: {
    type: String,
    enum: ['View Course', 'Buy Now'],
    default: 'View Course'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
