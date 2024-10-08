const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  logId: {
    type: Number,
    required: true,
  },
  subscriptionId: {
    type: Number,
    required: true,
  },
  sentAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
