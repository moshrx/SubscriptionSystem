const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isPremium: {type: Boolean, default: false},
  subscriptionDate: {type: Date, default: null},
  renewalDate: { type: Date, default: null },
  updatedAt: {type: Date, default: Date.now},
  createdAt: {type: Date, default: Date.now},
  resetPasswordToken: { type: String , default: null }, 
  resetPasswordExpires: { type: Date , default : null },
  emailSent15DaysBefore: { type: Boolean, default: false },    
  emailSent7DaysBefore: { type: Boolean, default: false },    
});

module.exports = mongoose.model('User', userSchema);
