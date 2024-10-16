const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPremium: { type: Boolean, default: false }, // Add premium field if required
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
