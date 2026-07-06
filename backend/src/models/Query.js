const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  countryCode: {
    type: String,
    default: '+91'
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true
  },
  querySection: {
    type: String,
    required: true
  },
  learningMode: {
    type: String,
    enum: ['Online', 'Classroom'],
    default: 'Online'
  },
  consent: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
