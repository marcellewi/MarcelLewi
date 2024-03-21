const mongoose = require('mongoose');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

module.exports = class Repository {
  static async initRepository() {
    const uri = env.DATABASE_URL;
    console.log(`Connecting to: ${uri}`);
    try {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
};
