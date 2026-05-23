const app = require('../src/app');
const { connectDB } = require('../src/config/db');
const { connectRedis } = require('../src/config/redis');
const logger = require('../src/utils/logger');

// Export an async function that ensures the DB is connected before handling the request
module.exports = async (req, res) => {
  try {
    await connectDB();
    // Redis connection doesn't strictly need to be awaited for basic functionality, 
    // but initializing it here ensures it starts.
    connectRedis();
  } catch (err) {
    logger.error('MongoDB connection failed in serverless wrapper:', err.message);
    return res.status(500).json({ success: false, error: 'Database connection failed' });
  }

  return app(req, res);
};
