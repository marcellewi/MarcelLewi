const mongoose = require('mongoose');

const notificationConfigSchema = new mongoose.Schema({
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  }],
  hoursBeforeNotification: { type: Number, required: true, default: 168 },
});

const NotificationConfig = mongoose.model('NotificationConfig', notificationConfigSchema);

module.exports = NotificationConfig;