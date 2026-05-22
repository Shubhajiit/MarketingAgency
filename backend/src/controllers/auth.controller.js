const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { z } = require('zod');
const User = require('../models/User');
const { env } = require('../config/env');
const { getRedis } = require('../config/redis');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Generate access and refresh tokens.
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });

  const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  });

  return { accessToken, refreshToken };
};

/**
 * Set refresh token as httpOnly cookie.
 */
const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });
};

// ─── Register ───────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    return ApiResponse.conflict(res, 'Email already registered');
  }

  const user = new User({
    name,
    email,
    passwordHash: password, // Pre-save hook will hash it
  });

  await user.save();

  logger.info(`User registered: ${email}`);

  return ApiResponse.created(res, { user: user.toJSON() }, 'Registration successful');
});

// ─── Login ──────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    return ApiResponse.unauthorized(res, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return ApiResponse.unauthorized(res, 'Invalid email or password');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  // Store refresh token
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  user.refreshTokens.push({
    token: crypto.createHash('sha256').update(refreshToken).digest('hex'),
    expiresAt,
    userAgent: req.headers['user-agent'] || '',
  });

  // Clean expired tokens
  user.cleanRefreshTokens();
  await user.save();

  setRefreshCookie(res, refreshToken);

  logger.info(`User logged in: ${email}`);

  return ApiResponse.success(res, {
    user: user.toJSON(),
    accessToken,
  }, 'Login successful');
});

// ─── Refresh ────────────────────────────────────────────────
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    return ApiResponse.unauthorized(res, 'Refresh token not found');
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    return ApiResponse.unauthorized(res, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.userId).select('+refreshTokens');
  if (!user) {
    return ApiResponse.unauthorized(res, 'User not found');
  }

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const storedToken = user.refreshTokens.find(
    (rt) => rt.token === tokenHash && rt.expiresAt > new Date()
  );

  if (!storedToken) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    return ApiResponse.unauthorized(res, 'Refresh token expired or revoked');
  }

  // Generate a new access token, but keep the existing refresh token
  // This prevents race conditions on rapid page reloads
  const accessToken = jwt.sign({ userId: user._id }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });

  return ApiResponse.success(res, {
    accessToken,
  }, 'Token refreshed');
});

// ─── Logout ─────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId).select('+refreshTokens');

      if (user) {
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== tokenHash);
        await user.save();
      }
    } catch {
      // Token invalid, proceed with logout anyway
    }
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  return ApiResponse.success(res, null, 'Logged out successfully');
});

// ─── Forgot Password ───────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  const user = await User.findOne({ email });

  // Always return success to prevent email enumeration
  if (!user) {
    return ApiResponse.success(res, null, 'If an account exists with this email, a reset link has been sent');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // In production, send email with reset link
  logger.info(`Password reset token generated for ${email}: ${resetToken}`);

  return ApiResponse.success(res, null, 'If an account exists with this email, a reset link has been sent');
});

// ─── Reset Password ────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = resetPasswordSchema.parse(req.body);

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    return ApiResponse.badRequest(res, 'Invalid or expired reset token');
  }

  user.passwordHash = password; // Pre-save hook will hash
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  user.refreshTokens = []; // Invalidate all sessions
  await user.save();

  logger.info(`Password reset for ${user.email}`);

  return ApiResponse.success(res, null, 'Password reset successful');
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  registerSchema,
  loginSchema,
};
