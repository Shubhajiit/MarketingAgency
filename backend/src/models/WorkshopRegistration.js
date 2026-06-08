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

    // Selected workshop date
    selectedDate: { type: Date, required: true },

    // Payment
    amountPaid: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'INR' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'paid',
    },
    paymentId: { type: String, default: '' }, // Razorpay payment ID (for future)

    // Extra
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Indexes for quick admin lookups
workshopRegistrationSchema.index({ workshopId: 1, createdAt: -1 });
workshopRegistrationSchema.index({ userId: 1 });

module.exports = mongoose.model('WorkshopRegistration', workshopRegistrationSchema);
