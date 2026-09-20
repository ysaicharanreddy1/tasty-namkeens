/**
 * db.js – MongoDB connection module
 * Establishes connection to MongoDB using Mongoose.
 * Handles connection events with clear console logging.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are the recommended settings for Mongoose 7+
      // (they are defaults in Mongoose 8+ but kept here for clarity)
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database Name  : ${conn.connection.name}`);

    // Mongoose connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    // Exit the process with failure – a DB connection is critical
    process.exit(1);
  }
};

module.exports = connectDB;
