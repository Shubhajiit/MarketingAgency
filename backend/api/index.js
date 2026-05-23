// Load environment variables first (needed for local dev; Vercel injects them in production)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const app = require('../src/app');
const { connectDB } = require('../src/config/db');
const { connectRedis } = require('../src/config/redis');
const logger = require('../src/utils/logger');

// Cache DB connection across warm invocations
let isConnected = false;

/**
 * Vercel serverless handler.
 * 
 * IMPORTANT: Vercel strips the /api prefix from req.url when the file is inside
 * the /api directory. So a request to /api/v1/auth/login arrives as /v1/auth/login
 * in req.url. However, req.originalUrl keeps the full path.
 * 
 * We fix req.url to restore /api prefix so Express routing works correctly.
 */
module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB();
      connectRedis();
      isConnected = true;
    }
  } catch (err) {
    logger.error('DB connection failed in serverless wrapper:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      data: null,
      errors: null,
    });
  }

  // Restore the /api prefix that Vercel strips from req.url
  // req.originalUrl is set by Express from req.url at app initialization
  // By restoring /api here, Express sees /api/v1/... which matches our routes
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }

  return app(req, res);
};
