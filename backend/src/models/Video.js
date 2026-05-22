const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP'],
      default: 'INR',
    },
    s3Key: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      default: '', // Public metadata URL (not the actual video)
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
videoSchema.index({ isPublished: 1 });
videoSchema.index({ workshop: 1 }, { sparse: true });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
