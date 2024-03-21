const { EventStatus } = require('../../utils/constants/eventStatus');
const { Pipeline } = require('../Validation/Pipeline');
const {
  validateDatesFilter,
  regulatoryUnityFilter,
} = require('../Validation/filters');
const EventRepository = require('../repositories/eventRepository');
const AuthModeRepository = require('../repositories/authModeRepository');
const {
  EventAuthorizationMode,
} = require('../../utils/constants/eventAuthorizationMode');
const AuthService = require('./authService');
const {
  NotFoundException,
  BadRequestException,
} = require('../exceptions/exceptions');
const NotificationConfigService = require('./notificationConfigService');
const emailQueue = require('../Queue/emailQueue');
const queriesQueue = require('../Queue/queriesQueue');
const logger = require('../../utils/logger');
const Action = require('../../utils/constants/QueryActions');

module.exports = class EventService {
  constructor() {
    this.eventRepository = new EventRepository();
    this.authModeRepository = new AuthModeRepository();
    this.authService = new AuthService();
    this.notificationConfigService = new NotificationConfigService();
  }

  async authorizeEvent(authorization, eventId) {
    let event;
    try {
      event = await this.eventRepository.getEvent(eventId);
    } catch (err) {
      logger.info(`PUT - AUTHORIZE EVENT - 404 - El evento con id ${eventId} no existe.`);
      throw new NotFoundException('El evento no existe.');
    }

    const isManualAuthMode = await this.isManualAuthMode();

    if (!isManualAuthMode) {
      throw new BadRequestException(
        'El modo de autorización esta en automatico.',
      );
    }

    if (event.statusInfo.status === EventStatus.APPROVED) {
      throw new BadRequestException('El evento ya ha sido autorizado.');
    }

    const authUser = this.authService.AuthUser(authorization);

    const pipeline = new Pipeline();

    pipeline.use(validateDatesFilter);
    pipeline.use(regulatoryUnityFilter);

    let validationErrors = [];

    validationErrors = await pipeline.run(event, validationErrors);

    if (validationErrors.length === 0) {
      const url = `http://localhost:3002/client/events/${event.id}`;
      event = await this.eventRepository.authorizeEvent(
        eventId,
        authUser.id,
        url,
      );
      logger.info(
        `PUT - VALIDATE EVENT - 200 - Se autorizo el evento con id ${event.id}`
      );

      const email = {
        to: event.supplier.email,
        subject: 'Evento autorizado',
        text: `El evento ${event.name} ha sido autorizado. Para acceder al mismo, ingrese a la siguiente URL: ${url}`,
      };
      emailQueue.enqueueTask(email);
    } else {
      event = await this.eventRepository.rejectEvent(eventId, authUser.id);
      logger.info(
        `PUT - VALIDATE EVENT - 200 - Se rechazo el evento con id ${event.id}`
      );

      const email = {
        to: event.supplier.email,
        subject: 'Evento autorizado',
        text: `Lo sentimos, el evento ${event.name} ha sido rechazado. Los errores encontrados son los siguientes: ${validationErrors}`,
      };
      emailQueue.enqueueTask(email);
    }

    queriesQueue.enqueueTask(event, Action.UPDATE_EVENT);
    return event;
  }

  async rejectEvent(authorization, eventId) {
    let event;
    try {
      event = await this.eventRepository.getEvent(eventId);
    } catch (err) {
      throw new NotFoundException('El evento no existe.');
    }

    const isManualAuthMode = await this.isManualAuthMode();

    if (!isManualAuthMode) {
      throw new BadRequestException(
        'El modo de autorización esta en automatico.',
      );
    }

    if (event.statusInfo.status === EventStatus.APPROVED) {
      throw new BadRequestException('El evento ya ha sido autorizado.');
    }

    const authUser = this.authService.AuthUser(authorization);

    event = await this.eventRepository.rejectEvent(eventId, authUser.id);

    logger.info(
      `PUT - REJECT EVENT - 200 - Se rechazo el evento con id ${event.id}`
    );

    const email = {
      to: event.supplier.email,
      subject: 'Evento autorizado',
      text: 'Lo sentimos, su evento ha sido rechazado debido a que no el evento no cumple con los requisitos necesarios. Por favor, intente nuevamente.',
    };
    emailQueue.enqueueTask(email);
    queriesQueue.enqueueTask(event, Action.UPDATE_EVENT);
    return event;
  }

  async isManualAuthMode() {
    const authMode = await this.authModeRepository.getAuthMode();
    return authMode === EventAuthorizationMode.MANUAL;
  }

  async changeAuthMode(authMode) {
    const resp = await this.authModeRepository.setAuthMode(authMode);
    logger.info(`PUT - CHANGE AUTH MODE - 200 - Modo de autorización cambiado a ${authMode}`);
    return resp;
  }

  async notifyPendingEvents() {
    const notificationConfig = await this.notificationConfigService.getNotificationConfig();

    const pendingEvents = await this.eventRepository.getPendingEvents(
      notificationConfig.hoursBeforeNotification,
    );

    if (pendingEvents.length === 0) return;

    const { recipients } = notificationConfig;

    recipients.forEach((recipient) => {
      const email = {
        to: recipient.email,
        subject: 'Eventos pendientes',
        text: `Los siguientes eventos estan pendientes de autorización, faltando ${
          notificationConfig.hoursBeforeStart
        } horas para su inicio: ${pendingEvents.map((event) => event.name)}`,
      };
      emailQueue.enqueueTask(email);
    });
  }
};
