const mongoose = require('mongoose');

// ─── Sub-schemas ──────────────────────────────────────────────
const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  totalSeats: { type: Number, default: 100 },
  bookedSeats: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  meetingLink: { type: String, default: '' },
}, { _id: true });

const highlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
}, { _id: false });

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: [String], default: [] },
}, { _id: false });

const targetAudienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
}, { _id: false });

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  image: { type: String, default: '' },
}, { _id: false });

// ─── Helper: title → slug ─────────────────────────────────────
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')       // spaces & underscores → dash
    .replace(/[^\w-]+/g, '')       // remove non-alphanumeric except dash
    .replace(/--+/g, '-')          // collapse multiple dashes
    .replace(/^-+|-+$/g, '');      // trim leading/trailing dashes
}

// ─── Main Workshop Schema ─────────────────────────────────────
const workshopSchema = new mongoose.Schema(
  {
    // Core
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    instructor: { type: String, default: '' },

    // Pricing
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, enum: ['INR', 'USD', 'EUR', 'GBP'], default: 'INR' },

    // Media (URL strings — Cloudinary URLs will go here later)
    thumbnail: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    brochureUrl: { type: String, default: '' },
    hasBrochure: { type: Boolean, default: true },

    // Batch / Schedule
    batchNumber: { type: String, default: '' },
    startDate: { type: Date, default: null },
    workshopTime: { type: String, default: '' }, // e.g. "10 AM IST", "6 PM GMT"
    duration: { type: String, default: '' },
    durationDetail: { type: String, default: '' },
    applicationDeadline: { type: Date, default: null },

    // Fee display overrides
    fee: { type: String, default: '' },
    feeNote: { type: String, default: '' },

    // Eligibility
    eligibility: { type: String, default: '' },
    eligibilityDetail: { type: String, default: '' },

    // Tags
    tags: { type: [String], default: [] },

    // Status
    isActive: { type: Boolean, default: true },

    // Rich content
    highlights: { type: [highlightSchema], default: [] },
    modules: { type: [moduleSchema], default: [] },
    targetAudience: { type: [targetAudienceSchema], default: [] },
    learningOutcomes: { type: [String], default: [] },
    experts: { type: [expertSchema], default: [] },
    slots: { type: [slotSchema], default: [] },
  },
  { timestamps: true }
);

// ─── Auto-generate slug from title ───────────────────────────
workshopSchema.pre('save', async function (next) {
  // Only auto-generate if slug is not provided or title was modified
  if (!this.slug || this.isModified('title')) {
    const baseSlug = slugify(this.title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure uniqueness
    while (true) {
      const existing = await mongoose.model('Workshop').findOne({
        slug,
        _id: { $ne: this._id },
      });
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────
workshopSchema.index({ slug: 1 });
workshopSchema.index({ isActive: 1, startDate: 1 });
workshopSchema.index({ tags: 1 });

module.exports = mongoose.model('Workshop', workshopSchema);
