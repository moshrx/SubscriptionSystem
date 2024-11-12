const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriptionId: {
    type: String,
    required: true,
    unique: true
  },
  appId: {
    type: Number,
    required: true,
    // ref:'Application'
  },
  userId: {
    type: String,
    required: true,
    ref:'User'
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
  }, 
  inActive: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
