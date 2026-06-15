const mongoose = require('mongoose');

const workshopRegistrationSchema = new mongoose.Schema(
  {
    // References
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
      required: true,
    },

    // Denormalized for easy admin display (so it's readable even if workshop is deleted)
    workshopTitle: { type: String, required: true },
    workshopSlug: { type: String, default: '' },

    // User details at time of registration
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsappNumber: { type: String, default: '' },
    age: { type: String, default: '' },
    profession: { type: String, default: '' },

    // Selected workshop date
    selectedDate: { type: Date, required: true },

    // Payment
    amountPaid: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'INR' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentId: { type: String, default: '' },           // Razorpay payment ID
    razorpayOrderId: { type: String, default: '' },     // Razorpay order ID
    razorpaySignature: { type: String, default: '' },   // Razorpay signature for audit

    // Cancellation & Refund
    isCancelled: { type: Boolean, default: false },
    cancellationEmailSent: { type: Boolean, default: false },
    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'refunded'],
      default: 'none',
    },

    // Extra
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Indexes for quick admin lookups
workshopRegistrationSchema.index({ workshopId: 1, createdAt: -1 });
workshopRegistrationSchema.index({ userId: 1 });
workshopRegistrationSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model('WorkshopRegistration', workshopRegistrationSchema);
