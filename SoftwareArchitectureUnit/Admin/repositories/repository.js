const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/admin');
const AuthMode = require('../models/authMode');
const NotificationConfig = require('../models/notificationConfig');

const env = dotenv.config().parsed;

module.exports = class Repository {
  static async initRepository() {
    const uri = env.DATABASE_URL;
    console.log(`Connecting to: ${uri}`);
    try {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
      let admin = await Admin.findOne({ username: 'admin' });
      if (!admin) {
        console.log('Creating default admin user');
        admin = await Admin.create({ username: 'admin', password: 'admin', email: 'admin@admin.com' });
      }

      const authMode = await AuthMode.findOne();
      if (!authMode) {
        console.log('Creating default event auth mode');
        await new AuthMode().save();
      }

      const notConfig = await NotificationConfig.findOne();

      if (!notConfig) {
        console.log('Creating default notification config');
        await new NotificationConfig({ hoursBeforeNotification: 168, recipients: [admin._id] }).save();
      }
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
};
