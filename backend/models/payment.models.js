const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: Number,
    required: true,
    unique: true
  },
  userId: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  transactionId: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
