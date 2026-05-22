const Redis = require('ioredis');
const { env } = require('./env');
const logger = require('../utils/logger');

let redis = null;

/**
 * In-memory cache fallback when Redis is not available.
 * Only suitable for single-process development use.
 */
class MemoryCache {
  constructor() {
    this._store = new Map();
    this._timers = new Map();
  }

  async get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;
    return entry;
  }

  async set(key, value, ...args) {
    this._store.set(key, value);
    // Handle EX option: set('key', 'val', 'EX', seconds)
    const exIdx = args.indexOf('EX');
    if (exIdx !== -1 && args[exIdx + 1]) {
      const seconds = parseInt(args[exIdx + 1], 10);
      if (this._timers.has(key)) clearTimeout(this._timers.get(key));
      this._timers.set(key, setTimeout(() => this._store.delete(key), seconds * 1000));
    }
    return 'OK';
  }

  async del(key) {
    this._store.delete(key);
    if (this._timers.has(key)) {
      clearTimeout(this._timers.get(key));
      this._timers.delete(key);
    }
    return 1;
  }

  async incr(key) {
    const val = parseInt(this._store.get(key) || '0', 10) + 1;
    this._store.set(key, String(val));
    return val;
  }

  async expire(key, seconds) {
    if (this._timers.has(key)) clearTimeout(this._timers.get(key));
    this._timers.set(key, setTimeout(() => this._store.delete(key), seconds * 1000));
    return 1;
  }

  async keys(pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return [...this._store.keys()].filter((k) => regex.test(k));
  }

  async flushdb() {
    this._store.clear();
    for (const timer of this._timers.values()) clearTimeout(timer);
    this._timers.clear();
    return 'OK';
  }

  get status() {
    return 'ready';
  }
}

const connectRedis = () => {
  if (env.REDIS_HOST) {
    try {
      redis = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) return null;
          return Math.min(times * 200, 2000);
        },
        enableReadyCheck: true,
        lazyConnect: false,
      });

      redis.on('connect', () => logger.info('Redis connected'));
      redis.on('error', (err) => logger.error('Redis error:', err.message));
      redis.on('close', () => logger.warn('Redis connection closed'));
    } catch (error) {
      logger.warn('Redis connection failed, using in-memory fallback:', error.message);
      redis = new MemoryCache();
    }
  } else {
    logger.info('No REDIS_HOST provided, using in-memory cache (dev only)');
    redis = new MemoryCache();
  }

  return redis;
};

const getRedis = () => {
  if (!redis) {
    return connectRedis();
  }
  return redis;
};

module.exports = { connectRedis, getRedis };
