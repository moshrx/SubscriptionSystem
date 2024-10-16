const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
<<<<<<< HEAD
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPremium: { type: Boolean, default: false }, // Add premium field if required
    createdAt: { type: Date, default: Date.now }
=======
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isPremium: {type: Boolean, default: false},
  subscriptionDate: {type: Date, default: null},
  updatedAt: {type: Date, default: Date.now},
  createdAt: {type: Date, default: Date.now},
  resetPasswordToken: { type: String , default: null }, 
  resetPasswordExpires: { type: Date , default : null },   
>>>>>>> c378ee18113c8ca0aa00d28a645568ab9c324ade
});

module.exports = mongoose.model('User', userSchema);
