const { getRedis } = require('../config/redis');
const ApiResponse = require('../utils/apiResponse');

/**
 * Redis-backed rate limiting middleware per IP per route.
 *
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 60000 = 1 min)
 * @param {number} options.max - Max requests per window (default: 60)
 * @param {string} options.prefix - Key prefix for grouping (default: 'rate')
 */
const rateLimiter = ({ windowMs = 60000, max = 60, prefix = 'rate' } = {}) => {
  return async (req, res, next) => {
    try {
      const redis = getRedis();
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const route = req.originalUrl.split('?')[0]; // Strip query params
      const key = `${prefix}:${ip}:${route}`;
      const windowSec = Math.ceil(windowMs / 1000);

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      // Set rate limit headers
      res.set('X-RateLimit-Limit', String(max));
      res.set('X-RateLimit-Remaining', String(Math.max(0, max - current)));

      if (current > max) {
        return ApiResponse.tooMany(res, 'Rate limit exceeded. Please try again later.');
      }

      next();
    } catch (error) {
      // On Redis failure, allow the request through (fail-open)
      next();
    }
  };
};

module.exports = { rateLimiter };
