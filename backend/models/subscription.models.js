const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriptionId: {
    type: Number,
    required: true,
    unique: true
  },
  appId: {
    type: Number,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  cost: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  subscriptionDate: {
    type: Date,
    required: true
  },
  renewalDate: {
    type: Date,
    required: true
  },
  reminderEnabled: {
    type: Boolean,
    default: false
  },
  reminderDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
