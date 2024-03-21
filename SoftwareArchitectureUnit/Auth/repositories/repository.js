const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Roles } = require('../../utils/constants/roles');
const User = require('../models/user');

dotenv.config();
const uri = process.env.MONGODB_AUTH_DB;

async function connectToMongoDatabase() {
  console.log(`Connecting to: ${uri}`);
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      console.log('Creating default admin user');
      await User.create({ username: 'admin', password: '$2b$10$h24rSA0nWr10C38v8iH4e.TK3Bg/JbDb9OWXiW1i2coPRQwNRFbiO', role: Roles.ADMIN });
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = { connectToMongoDatabase };
