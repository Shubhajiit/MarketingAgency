const mongoose = require('mongoose');
const { env } = require('./env');
const logger = require('../utils/logger');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    logger.info('Initializing new MongoDB connection...');
    const opts = {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false, // Fail fast if connection drops
    };

    cached.promise = mongoose.connect(env.MONGODB_URI, opts).then((mongoose) => {
      logger.info(`MongoDB connected: ${mongoose.connection.host}`);
      return mongoose;
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnect...');
      cached.conn = null;
      cached.promise = null;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    logger.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = { connectDB };
