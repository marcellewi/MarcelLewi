const axios = require('axios');
const EventRepository = require('../repositories/eventRepository');
const AuthModeRepository = require('../repositories/authModeRepository');
const { EventStatus } = require('../../utils/constants/eventStatus');
const {
  EventAuthorizationMode,
} = require('../../utils/constants/eventAuthorizationMode');
const { Pipeline } = require('../Validation/Pipeline');
const {
  validateDatesFilter,
  regulatoryUnityFilter,
  paymentGatewayFilter,
} = require('../Validation/filters');
const AuthService = require('./authService');
const {
  BadRequestException,
  NotFoundException,
} = require('../exceptions/exceptions');

const emailQueue = require('../Queue/emailQueue');
const ClientRepository = require('../repositories/clientRepository');

const logger = require('../../utils/logger');
const loggerBitacora = require('../../utils/bitacoraLogger');
const queriesQueue = require('../Queue/queriesQueue');
const Action = require('../../utils/constants/QueryActions');

class EventService {
  constructor() {
    this.eventRepository = new EventRepository();
    this.authModeRepository = new AuthModeRepository();
    this.authService = new AuthService();
    this.clientRepository = new ClientRepository();
  }

  async createEvent(
    authorization,
    name,
    description,
    price,
    eventDatesInfo,
    category,
    thumbnail,
    mainImage,
    video,
  ) {
    const supplier = await this.authService.AuthUser(authorization);
    const newEvent = await this.eventRepository.createEvent(
      name,
      description,
      price || supplier.defaultPrice,
      eventDatesInfo,
      thumbnail,
      mainImage,
      category,
      video,
      supplier.id,
    );
    if (await this.isAutoAuthMode()) {
      this.validateEvent(newEvent.id);
    }
    logger.info(
      `POST - CREATE EVENT - 200 - Se creo el evento con id ${newEvent.id}`,
    );
    loggerBitacora.info(
      `POST - CREATE EVENT - 200 - Se creo el evento con id ${newEvent.id}`,
    );
    return newEvent;
  }

  async editEvent(
    eventId,
    name,
    description,
    price,
    eventDatesInfo,
    category,
    thumbnail,
    mainImage,
    video,
  ) {
    const event = await this.eventRepository.getEvent(eventId);
    if (!event) {
      logger.error(
        `PUT - EDIT EVENT - 404 - No se encontro el evento con id ${eventId}`,
      );
      loggerBitacora.error(
        `PUT - EDIT EVENT - 404 - No se encontro el evento con id ${eventId}`,
      );
      throw new NotFoundException('No se encontro el evento');
    }

    if (event.statusInfo.status === EventStatus.APPROVED) {
      logger.error(
        `PUT - EDIT EVENT - 400 - No se puede editar el evento ${eventId} ya que se encuentra aprobado`,
      );
      loggerBitacora.error(
        `PUT - EDIT EVENT - 400 - No se puede editar el evento ${eventId} ya que se encuentra aprobado`,
      );
      throw new BadRequestException(
        'No se puede editar este evento ya que se encuentra aprobado',
      );
    }

    const editedEvent = await this.eventRepository.editEvent(
      eventId,
      name,
      description,
      price || supplier.defaultPrice,
      eventDatesInfo,
      thumbnail,
      mainImage,
      category,
      video,
    );

    if (await this.isAutoAuthMode()) {
      this.validateEvent(editedEvent.id);
    }
    logger.info(
      `PUT - EDIT EVENT - 200 - Se edito el evento con id ${eventId}`,
    );
    loggerBitacora.info(
      `PUT - EDIT EVENT - 200 - Se edito el evento con id ${eventId}`,
    );
    return editedEvent;
  }
 
  async validateEvent(eventId) {
    let event = await this.eventRepository.getEvent(eventId);
    if (!event) throw new NotFoundException('No se encontro el evento');

    const pipeline = new Pipeline();

    pipeline.use(validateDatesFilter);
    pipeline.use(regulatoryUnityFilter);
    pipeline.use(paymentGatewayFilter);

    let validationErrors = [];

    validationErrors = await pipeline.run(event, validationErrors);

    if (validationErrors.length > 0) {
      event = await this.eventRepository.rejectEvent(event.id);
      logger.info(
        `PUT - VALIDATE EVENT - 200 - Se rechazo el evento con id ${event.id}`,
      );
      const email = {
        to: event.supplier.email,
        subject: 'Evento Rechazado',
        text: `Lo sentimos, el evento ${event.name} ha sido rechazado. Los errores encontrados son los siguientes: ${validationErrors}`,
      };
      emailQueue.enqueueTask(email);
    } else {
      const url = `http://localhost:3002/client/events/${event.id}`;
      event = await this.eventRepository.authorizeEvent(event.id, url);
      logger.info(
        `PUT - VALIDATE EVENT - 200 - Se autorizo el evento con id ${event.id}`,
      );
      const email = {
        to: event.supplier.email,
        subject: 'Evento autorizado',
        text: `El evento ${event.name} ha sido autorizado. Para acceder al mismo, ingrese a la siguiente URL: ${url}`,
      };
      emailQueue.enqueueTask(email);
    }

    queriesQueue.enqueueTask(event, Action.UPDATE_EVENT);
  }

  async isAutoAuthMode() {
    const authMode = await this.authModeRepository.getAuthMode();
    if (!authMode) throw new NotFoundException('No se encontro authMode');
    return authMode === EventAuthorizationMode.AUTO;
  }

  async sendEmailToEventBuyers(eventId, message) {
    const event = await this.eventRepository.getEvent(eventId);
    if (!event) throw new NotFoundException('No se encontro el evento');

    const { buyers } = event;

    buyers.forEach(async (buyer) => {
      const client = await this.clientRepository.get(buyer.clientId);
      const email = {
        to: client.email,
        subject: `Nuevo mensaje del evento ${event.name}`,
        text: message,
        isEventEmail: event.id,
      };
      emailQueue.enqueueTask(email);
    });
  }

  async confirmEmailSent(eventId, emailSent) {
    const event = await this.eventRepository.getEvent(eventId);
    if (!event) throw new NotFoundException('No se encontro el evento');
    logger.info(
      `PUT - CONFIRM EMAIL SENT - 200 - Se confirmo el envio del email del evento con id ${eventId}`,
    );
    emailSent
      ? await this.eventRepository.confirmEmailSent(eventId)
      : await this.eventRepository.confirmEmailFailed(eventId);
  }
}

module.exports = EventService;
