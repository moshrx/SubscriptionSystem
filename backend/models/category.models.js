const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: Number,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Category', categorySchema);
