const mongoose = require('mongoose');

const courseEnrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
    default: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
    index: true,
  },
  paymentId: {
    type: String, // Razorpay payment ID (set on success)
    default: null,
  },
  razorpayOrderId: {
    type: String, // Razorpay order ID
    default: null,
  },
  razorpaySignature: {
    type: String,
    default: null,
  },
}, { timestamps: true });

// Compound index to prevent duplicate paid enrollments per user+course
courseEnrollmentSchema.index({ userId: 1, courseId: 1 });

module.exports = mongoose.model('CourseEnrollment', courseEnrollmentSchema);
