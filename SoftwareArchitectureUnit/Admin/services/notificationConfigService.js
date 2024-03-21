const logger = require('../../utils/logger');
const notificationConfigRepository = require('../repositories/notificationConfigRepository');

module.exports = class NotificationConfigService {
  constructor() {
    this.notificationConfigRepository = new notificationConfigRepository();
  }

  async getNotificationConfig() {
    const notificationConfig = await this.notificationConfigRepository.getNotificationConfig();
    return notificationConfig;
  }

  async modifyNotificationConfig(recipients, hoursBeforeNotification) {
    const notificationConfig = await this.notificationConfigRepository.modifyNotificationConfig(recipients, hoursBeforeNotification);
    logger.info(`Notification config modified ${notificationConfig}`);
    return notificationConfig;
  }
};
