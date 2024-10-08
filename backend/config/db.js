const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Get MongoDB URI from environment variables or use a fallback URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/subscriptionmanagement';

const connectDB = async () => {
  try {
    // Establish connection to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Exit process with failure
  }
};

// Export the connection function
module.exports = connectDB;
