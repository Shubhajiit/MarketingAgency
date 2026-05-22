const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// ─── Get Profile ────────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('purchasedVideos', 'title thumbnail')
    .lean();

  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  return ApiResponse.success(res, { user });
});

// ─── Update Profile ─────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'avatar'];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).lean();

  return ApiResponse.success(res, { user }, 'Profile updated');
});

module.exports = {
  getProfile,
  updateProfile,
};
