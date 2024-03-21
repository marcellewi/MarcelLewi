const NotificationConfig = require('../models/notificationConfig');

module.exports = class NotificationConfigRepository {
  async getNotificationConfig() {
    const notificationConfig = await NotificationConfig.findOne()
      .populate('recipients')
      .exec();
    return notificationConfig;
  }

  async modifyNotificationConfig(recipients, hoursBeforeNotification) {
    const notificationConfig = await NotificationConfig.findOne();
    if (notificationConfig) {
      notificationConfig.recipients = recipients;
      notificationConfig.hoursBeforeNotification = hoursBeforeNotification;
      await notificationConfig.save();
      return notificationConfig;
    }
    const newNotificationConfig = await new NotificationConfig({
      recipients,
      hoursBeforeNotification,
    });
    await newNotificationConfig.save();
    return newNotificationConfig;
  }
};
