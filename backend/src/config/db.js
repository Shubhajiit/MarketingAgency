const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment');
  }

  let connectionString = process.env.MONGODB_URI;
  if (!connectionString.includes('readPreference=')) {
    const separator = connectionString.includes('?') ? '&' : '?';
    connectionString = `${connectionString}${separator}readPreference=secondaryPreferred`;
  }

  await mongoose.connect(connectionString, {
    maxPoolSize: 100,
    minPoolSize: 10,
  });
  console.log('MongoDB connected');
};

module.exports = connectDB;
