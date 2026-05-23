const { z } = require('zod');
const Workshop = require('../models/Workshop');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { invalidateCache } = require('../middleware/cache');

// Validation schemas
const createWorkshopSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional().default(''),
  description: z.string().min(1).max(5000),
  instructor: z.string().min(1),
  price: z.number().min(0),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']).default('INR'),
  thumbnail: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),

  // Detail page fields
  batchNumber: z.string().optional().default(''),
  startDate: z.string().optional().nullable().transform((v) => (v ? new Date(v) : null)),
  duration: z.string().optional().default(''),
  durationDetail: z.string().optional().default(''),
  fee: z.string().optional().default(''),
  feeNote: z.string().optional().default(''),
  eligibility: z.string().optional().default(''),
  eligibilityDetail: z.string().optional().default(''),
  applicationDeadline: z.string().optional().nullable().transform((v) => (v ? new Date(v) : null)),
  heroImage: z.string().optional().default(''),
  brochureUrl: z.string().optional().default(''),

  // Rich content arrays
  highlights: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional().default(''),
  })).optional().default([]),

  modules: z.array(z.object({
    title: z.string().min(1),
    content: z.array(z.string()).optional().default([]),
  })).optional().default([]),

  targetAudience: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional().default(''),
  })).optional().default([]),

  learningOutcomes: z.array(z.string()).optional().default([]),

  experts: z.array(z.object({
    name: z.string().min(1),
    role: z.string().optional().default(''),
    image: z.string().optional().default(''),
  })).optional().default([]),

  // Slots
  slots: z.array(z.object({
    date: z.string().transform((v) => new Date(v)),
    startTime: z.string(),
    endTime: z.string(),
    totalSeats: z.number().min(1),
    meetingLink: z.string().optional().default(''),
  })).optional().default([]),
});

// ─── List Workshops ─────────────────────────────────────────
const listWorkshops = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, tag } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { isActive: true };
  if (tag) filter.tags = tag;

  const [workshops, total] = await Promise.all([
    Workshop.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Workshop.countDocuments(filter),
  ]);

  return ApiResponse.success(res, {
    workshops,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ─── Get Workshop Detail by ID ──────────────────────────────
const getWorkshop = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id).lean();

  if (!workshop) {
    return ApiResponse.notFound(res, 'Workshop not found');
  }

  return ApiResponse.success(res, { workshop });
});

// ─── Get Workshop Detail by Slug ────────────────────────────
const getWorkshopBySlug = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findOne({
    slug: req.params.slug,
    isActive: true,
  }).lean();

  if (!workshop) {
    return ApiResponse.notFound(res, 'Workshop not found');
  }

  return ApiResponse.success(res, { workshop });
});

// ─── Create Workshop (Admin) ────────────────────────────────
const createWorkshop = asyncHandler(async (req, res) => {
  const data = createWorkshopSchema.parse(req.body);

  const workshop = new Workshop(data);
  await workshop.save();

  await invalidateCache('workshop:list');

  return ApiResponse.created(res, { workshop }, 'Workshop created');
});

// ─── Update Workshop (Admin) ────────────────────────────────
const updateWorkshop = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);

  if (!workshop) {
    return ApiResponse.notFound(res, 'Workshop not found');
  }

  // Update fields
  Object.assign(workshop, req.body);
  await workshop.save(); // triggers pre-save hook for slug regeneration if title changed

  await invalidateCache(`workshop:${req.params.id}`, 'workshop:list');

  return ApiResponse.success(res, { workshop }, 'Workshop updated');
});

// ─── Delete Workshop (Admin) ────────────────────────────────
const deleteWorkshop = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!workshop) {
    return ApiResponse.notFound(res, 'Workshop not found');
  }

  await invalidateCache(`workshop:${req.params.id}`, 'workshop:list');

  return ApiResponse.success(res, null, 'Workshop deleted');
});

module.exports = {
  listWorkshops,
  getWorkshop,
  getWorkshopBySlug,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
};
