const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  logId: {
    type: Number,
    required: true,
  },
  subscriptionId: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
