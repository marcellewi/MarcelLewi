const {
  evalException,
  HttpErrorCodes,
} = require('../exceptions/exceptions');
const EventService = require('../services/eventService');
const NotificationConfigService = require('../services/notificationConfigService');

module.exports = class EventController {
  constructor() {
    this.eventService = new EventService();
    this.notificationConfigService = new NotificationConfigService();
  }

  async authorizeEvent(req, res) {
    try {
      const { eventId } = req.params;

      const event = await this.eventService.authorizeEvent(
        req.headers.authorization,
        eventId,
      );
      return res.status(HttpErrorCodes.HTTP_200_OK).json(event);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async rejectEvent(req, res) {
    try {
      const { eventId } = req.params;

      const event = await this.eventService.rejectEvent(
        req.headers.authorization,
        eventId,
      );
      return res.status(HttpErrorCodes.HTTP_200_OK).json(event);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async changeAuthMode(req, res) {
    try {
      const { authMode } = req.body;

      const event = await this.eventService.changeAuthMode(authMode);
      return res.status(HttpErrorCodes.HTTP_200_OK).json(event);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async updateNotificationConfig(req, res) {
    try {
      const { recipients, hoursBeforeNotification } = req.body;

      const notificationConfig = await this.notificationConfigService.modifyNotificationConfig(
        recipients,
        hoursBeforeNotification,
      );

      return res.status(HttpErrorCodes.HTTP_200_OK).json(notificationConfig);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async getNotificationConfig(req, res) {
    try {
      const notificationConfig = await this.notificationConfigService.getNotificationConfig();

      return res.status(HttpErrorCodes.HTTP_200_OK).json(notificationConfig);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async notifyPendingEvents(req, res) {
    try {
      await this.eventService.notifyPendingEvents();
      return res.status(HttpErrorCodes.HTTP_200_OK).json();
    } catch (err) {
      return evalException(err, res);
    }
  }
};
