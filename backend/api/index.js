const app = require('../src/app');
const { connectDB } = require('../src/config/db');
const { connectRedis } = require('../src/config/redis');
const logger = require('../src/utils/logger');

// Establish database connections when the serverless function cold-starts
connectDB().catch(err => logger.error('MongoDB connection failed:', err.message));
connectRedis();

// Export the Express app as a serverless function handler
module.exports = app;
