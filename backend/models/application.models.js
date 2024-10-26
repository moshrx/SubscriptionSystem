const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  appId: {
    type: Number,
    required: true,
    unique: true
  },
  categoryId: {
    type: Number,
    required: true
  },
  appName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Application', applicationSchema, 'application');
