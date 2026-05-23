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

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: [{ type: String, trim: true }],
  },
  { _id: false }
);

const highlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const targetAudienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Workshop title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    subtitle: {
      type: String,
      default: '',
      maxlength: 500,
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

    // Detail page fields
    batchNumber: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    duration: {
      type: String,
      default: '',
      trim: true,
    },
    durationDetail: {
      type: String,
      default: '',
      trim: true,
    },
    fee: {
      type: String,
      default: '',
      trim: true,
    },
    feeNote: {
      type: String,
      default: '',
      trim: true,
    },
    eligibility: {
      type: String,
      default: '',
      trim: true,
    },
    eligibilityDetail: {
      type: String,
      default: '',
      trim: true,
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    heroImage: {
      type: String,
      default: '',
    },
    brochureUrl: {
      type: String,
      default: '',
    },

    // Rich content arrays
    highlights: [highlightSchema],
    modules: [moduleSchema],
    targetAudience: [targetAudienceSchema],
    learningOutcomes: [{ type: String, trim: true }],
    experts: [expertSchema],

    // Existing fields
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

// Pre-save hook: auto-generate slug from title
workshopSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check for uniqueness
    let slug = baseSlug;
    let counter = 1;
    const Workshop = mongoose.model('Workshop');
    while (true) {
      const existing = await Workshop.findOne({
        slug,
        _id: { $ne: this._id },
      });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

// Indexes

workshopSchema.index({ isActive: 1 });
workshopSchema.index({ 'slots.date': 1 });
workshopSchema.index({ tags: 1 });
workshopSchema.index({ isActive: 1, 'slots.date': 1 }); // Compound for listing filters

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;
