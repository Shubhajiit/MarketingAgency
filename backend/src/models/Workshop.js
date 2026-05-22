const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true, // e.g., "10:00"
    },
    endTime: {
      type: String,
      required: true, // e.g., "12:30"
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    bookedSeats: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    meetingLink: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Workshop title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
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
    thumbnail: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    slots: [slotSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: available seats
workshopSchema.virtual('availableSlots').get(function () {
  return this.slots.filter(
    (slot) => slot.isAvailable && slot.bookedSeats < slot.totalSeats
  );
});

// Indexes
workshopSchema.index({ isActive: 1 });
workshopSchema.index({ 'slots.date': 1 });
workshopSchema.index({ tags: 1 });
workshopSchema.index({ isActive: 1, 'slots.date': 1 }); // Compound for listing filters

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;
