const mongoose = require('mongoose');

// ─── Sub-schemas ──────────────────────────────────────────────
const highlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
}, { _id: false });

const whatYouWillLearnStepSchema = new mongoose.Schema({
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

const courseOutcomeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
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
    instructorImage: { type: String, default: '' },
    instructorDescription: { type: String, default: '' },

    // Pricing
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, default: 0 },
    priceCaption: { type: String, default: '' },
    bonusDeadlineText: { type: String, default: '' },
    currency: { type: String, enum: ['INR', 'USD', 'EUR', 'GBP'], default: 'INR' },

    // Media (URL strings — Cloudinary URLs will go here later)
    thumbnail: { type: String, default: '' },

    // Tags
    tags: { type: [String], default: [] },

    // Status
    isActive: { type: Boolean, default: true },
    isCancelled: { type: Boolean, default: false },

    // Rich content
    highlights: { type: [highlightSchema], default: [] },
    modules: { type: [moduleSchema], default: [] },
    targetAudience: { type: [targetAudienceSchema], default: [] },
    learningOutcomes: { type: [String], default: [] },
    whatYouWillLearn: { type: [whatYouWillLearnStepSchema], default: [] },
    courseOutcomes: { type: [courseOutcomeSchema], default: [] },
    experts: { type: [expertSchema], default: [] },
    heroPoints: { type: [String], default: [] },
    workshopDates: { type: [mongoose.Schema.Types.Mixed], default: [] },

    // Ratings
    rating1Value: { type: String, default: '4.5/5' },
    rating1Count: { type: String, default: '(725)' },
    rating1Platform: { type: String, default: 'Trustpilot' },
    rating2Value: { type: String, default: '4.07/5' },
    rating2Count: { type: String, default: '(88)' },
    rating2Platform: { type: String, default: 'Rating Facts' },

    // Type of Workshop
    type: { type: String, enum: ['one-day', 'three-days'], default: 'one-day' },
    deadline: { type: Date, default: null },

    // Brochure
    brochureUrl: { type: String, default: '' },
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
workshopSchema.index({ isActive: 1 });
workshopSchema.index({ tags: 1 });

module.exports = mongoose.model('Workshop', workshopSchema);
