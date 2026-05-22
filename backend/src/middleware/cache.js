const { getRedis } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Redis response caching middleware.
 * Wraps routes with cached responses to speed up read-heavy endpoints.
 *
 * @param {string} keyPrefix - Cache key prefix (e.g., 'workshop:list')
 * @param {number} ttl - Cache TTL in seconds (default: 300 = 5 min)
 * @param {Function} [keyGenerator] - Optional function(req) => string for dynamic keys
 */
const cacheMiddleware = (keyPrefix, ttl = 300, keyGenerator = null) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') return next();

    try {
      const redis = getRedis();
      const cacheKey = keyGenerator
        ? `${keyPrefix}:${keyGenerator(req)}`
        : keyPrefix;

      const cached = await redis.get(cacheKey);

      if (cached) {
        const data = JSON.parse(cached);
        res.set('X-Cache', 'HIT');
        return res.status(200).json(data);
      }

      // Override res.json to intercept the response and cache it
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode === 200 && body && body.success) {
          redis
            .set(cacheKey, JSON.stringify(body), 'EX', ttl)
            .catch((err) => logger.error('Cache write error:', err.message));
        }
        res.set('X-Cache', 'MISS');
        return originalJson(body);
      };

      next();
    } catch (error) {
      // On cache failure, proceed without caching
      next();
    }
  };
};

/**
 * Invalidate cache by key or pattern.
 */
const invalidateCache = async (...keys) => {
  try {
    const redis = getRedis();
    for (const key of keys) {
      if (key.includes('*')) {
        const matchingKeys = await redis.keys(key);
        if (matchingKeys.length > 0) {
          for (const k of matchingKeys) {
            await redis.del(k);
          }
        }
      } else {
        await redis.del(key);
      }
    }
  } catch (error) {
    logger.error('Cache invalidation error:', error.message);
  }
};

module.exports = { cacheMiddleware, invalidateCache };
