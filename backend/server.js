require('dotenv').config();

const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const { env } = require('./src/config/env');
const logger = require('./src/utils/logger');

// Connect to MongoDB & Redis in background (using mongoose/ioredis connection buffering)
connectDB().catch(err => logger.error('MongoDB connection failed:', err.message));
connectRedis();

const PORT = parseInt(env.PORT, 10) || 5000;

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    logger.info(`Health check: http://localhost:${PORT}/api/v1/health`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      logger.info('HTTP server closed');

      const mongoose = require('mongoose');
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');

      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Unhandled rejection handler
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });
}

module.exports = app;
