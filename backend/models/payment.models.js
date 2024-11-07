const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
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
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
