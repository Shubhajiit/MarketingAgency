const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Workshop = require('../models/Workshop');
const Video = require('../models/Video');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// ─── Admin Dashboard Stats ──────────────────────────────────
const getStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalWorkshops,
    totalBookings,
    totalVideos,
    totalRevenue,
    recentBookings,
  ] = await Promise.all([
    User.countDocuments(),
    Workshop.countDocuments({ isActive: true }),
    Booking.countDocuments({ paymentStatus: 'paid' }),
    Video.countDocuments({ isPublished: true }),
    Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Booking.find({ paymentStatus: 'paid' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('workshop', 'title')
      .lean(),
  ]);

  return ApiResponse.success(res, {
    stats: {
      totalUsers,
      totalWorkshops,
      totalBookings,
      totalVideos,
      totalRevenue: recentBookings.length > 0 ? totalRevenue[0]?.total || 0 : 0,
    },
    recentBookings,
  });
});

// ─── Admin: List All Bookings ───────────────────────────────
const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (status) filter.paymentStatus = status;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('user', 'name email')
      .populate('workshop', 'title instructor')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Booking.countDocuments(filter),
  ]);

  return ApiResponse.success(res, {
    bookings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ─── Admin: List All Users ──────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find()
      .select('name email role isEmailVerified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(),
  ]);

  return ApiResponse.success(res, {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

module.exports = {
  getStats,
  getAllBookings,
  getAllUsers,
};
