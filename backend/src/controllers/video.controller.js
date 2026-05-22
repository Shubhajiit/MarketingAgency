const Video = require('../models/Video');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { getSignedVideoUrl } = require('../services/s3.service');

// ─── List Published Videos ──────────────────────────────────
const listVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, tag } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { isPublished: true };
  if (tag) filter.tags = tag;

  const [videos, total] = await Promise.all([
    Video.find(filter)
      .select('title description thumbnail duration price currency tags createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Video.countDocuments(filter),
  ]);

  return ApiResponse.success(res, {
    videos,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ─── Get Video Detail ───────────────────────────────────────
const getVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id)
    .select('title description thumbnail duration price currency tags isPublished createdAt')
    .lean();

  if (!video || !video.isPublished) {
    return ApiResponse.notFound(res, 'Video not found');
  }

  // Check if user has purchased this video
  let hasPurchased = false;
  let videoUrl = null;

  if (req.user) {
    const user = await User.findById(req.user._id).lean();
    hasPurchased = user.purchasedVideos?.some(
      (vid) => vid.toString() === req.params.id
    );

    if (hasPurchased) {
      const fullVideo = await Video.findById(req.params.id).lean();
      videoUrl = await getSignedVideoUrl(fullVideo.s3Key);
    }
  }

  return ApiResponse.success(res, {
    video: { ...video, hasPurchased, videoUrl },
  });
});

// ─── Get My Purchased Videos ────────────────────────────────
const getMyVideos = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('purchasedVideos', 'title description thumbnail duration tags')
    .lean();

  return ApiResponse.success(res, {
    videos: user.purchasedVideos || [],
  });
});

// ─── Purchase Video (creates a booking-like record) ─────────
const purchaseVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video || !video.isPublished) {
    return ApiResponse.notFound(res, 'Video not found');
  }

  // Check if already purchased
  const user = await User.findById(req.user._id);
  if (user.purchasedVideos.includes(video._id)) {
    return ApiResponse.badRequest(res, 'Video already purchased');
  }

  return ApiResponse.success(res, {
    video: {
      id: video._id,
      title: video.title,
      price: video.price,
      currency: video.currency,
    },
    message: 'Proceed to payment',
  });
});

// ─── Admin: Create Video ──────────────────────────────────────
const createVideo = asyncHandler(async (req, res) => {
  const { title, description, s3Key, thumbnail, duration, price, currency, tags, isPublished } = req.body;

  if (!title || !s3Key || !price) {
    return ApiResponse.badRequest(res, 'Title, S3Key, and Price are required');
  }

  const video = await Video.create({
    title,
    description,
    s3Key,
    thumbnail,
    duration,
    price,
    currency,
    tags,
    isPublished,
  });

  return ApiResponse.created(res, { video }, 'Video created successfully');
});

// ─── Admin: Update Video ──────────────────────────────────────
const updateVideo = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!video) {
    return ApiResponse.notFound(res, 'Video not found');
  }

  return ApiResponse.success(res, { video }, 'Video updated successfully');
});

// ─── Admin: Delete Video ──────────────────────────────────────
const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndDelete(req.params.id);

  if (!video) {
    return ApiResponse.notFound(res, 'Video not found');
  }

  return ApiResponse.success(res, null, 'Video deleted successfully');
});

module.exports = {
  listVideos,
  getVideo,
  getMyVideos,
  purchaseVideo,
  createVideo,
  updateVideo,
  deleteVideo,
};
