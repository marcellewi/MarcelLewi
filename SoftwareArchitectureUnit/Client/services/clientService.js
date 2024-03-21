const dotenv = require('dotenv');
const axios = require('axios');

const path = require('path');
const fs = require('fs');
const ClientRepository = require('../repositories/clientRepository');
const EventRepository = require('../repositories/eventRepository');
const SupplierRepository = require('../repositories/supplierRepository');
const { Roles } = require('../../utils/constants/roles');
const {
  NotFoundException,
  BadRequestException,
} = require('../exceptions/exceptions');

const queue = require('../Queue/paymentQueue');

dotenv.config();

const logger = require('../../utils/logger');
const loggerBitacora = require('../../utils/bitacoraLogger');
const { EventStatus } = require('../../utils/constants/eventStatus');
const AuthService = require('./authService');
const queriesQueue = require('../Queue/queriesQueue');
const Action = require('../../utils/constants/QueryActions');

class ClientService {
  constructor() {
    this.clientRepository = new ClientRepository();
    this.eventRepository = new EventRepository();
    this.supplierRepository = new SupplierRepository();
    this.authService = new AuthService();
  }

  async register(username, birthday, country, email, password) {
    const user = await this.clientRepository.getByUsername(username);
    if (user) {
      logger.error(`POST - REGISTER CLIENT - 400 - Ya existe un cliente con el nombre ${username}`);
      throw new Error('User already exists.');
    }

    const newUser = await this.clientRepository.createClient(
      username,
      birthday,
      country,
      email,
    );

    const response = await axios.post('http://localhost:3001/auth/register', {
      _id: newUser._id,
      username,
      password,
      role: Roles.CLIENT,
    });
    if (response.status !== 200) {
      logger.error(`POST - REGISTER CLIENT - 400 - No fue posible crear al usuario: ${username}`);
      newUser.remove();
      throw new Error('No se pudo crear el usuario');
    }

    logger.info(`POST - REGISTER CLIENT - 200 - Se creo el cliente ${username} de forma correcta`);
    return newUser;
  }

  async buyEvent(auth, eventName, supplierName, QueryRequestTimeStamp) {
    const client = await this.authService.AuthUser(auth);

    if (!client) {
      logger.error(`POST - BUY EVENT - 404 - No se encontro el cliente ${client.username}`);
      loggerBitacora.error(`POST - BUY EVENT - 404 - No se encontro el cliente ${client.username}`);
      throw new NotFoundException('No se encontro el cliente');
    }

    const event = await this.eventRepository.get(eventName);
    if (!event) {
      logger.error(`POST - BUY EVENT - 404 - No se encontro el evento ${eventName}`);
      loggerBitacora.error(`POST - BUY EVENT - 404 - No se encontro el evento ${eventName}`);
      throw new NotFoundException('No se encontro el evento');
    }

    const supplier = await this.supplierRepository.get(supplierName);
    if (!supplier) {
      logger.error(`POST - BUY EVENT - 404 - No se encontro el proveedor ${supplierName}`);
      loggerBitacora.error(`POST - BUY EVENT - 404 - No se encontro el proveedor ${supplierName}`);
      throw new NotFoundException('No se encontro el proveedor');
    }

    if (event.supplier.toString() !== supplier.id) {
      logger.error(`POST - BUY EVENT - 400 - El evento ${eventName} no pertenece al proveedor ${supplierName}`);
      loggerBitacora.error(`POST - BUY EVENT - 400 - El evento ${eventName} no pertenece al proveedor ${supplierName}`);
      throw new BadRequestException(
        'El evento no pertenece al proveedor que se especificó',
      );
    }

    await this.validateEvent(event, QueryRequestTimeStamp);

    const clientsIds = event.buyers.map((buyer) => buyer.client.toString());
    if (clientsIds.includes(client.id)) {
      logger.error(`POST - BUY EVENT - 400 - El cliente ${client.username} ya compro el evento ${eventName}`);
      loggerBitacora.error(`POST - BUY EVENT - 400 - El cliente ${client.username} ya compro el evento ${eventName}`);
      throw new BadRequestException('El cliente ya compro este evento');
    }

    try {
      const payment = {
        event: event.name,
        email: client.email,
        name: client.username,
        requestTime: QueryRequestTimeStamp,
      };
      queue.enqueueTask(payment);
      logger.info(`POST - BUY EVENT - 200 - La compra del evento ${eventName} por parte del cliente ${client.username} se esta procesando correctamente`);
      loggerBitacora.info(`POST - BUY EVENT - 200 - La compra del evento ${eventName} por parte del cliente ${client.username} se esta procesando correctamente`);

      return { message: 'La compra se esta procesando correctamente' };
    } catch (error) {
      loggerBitacora.error(`POST - BUY EVENT - 400 - No se pudo procesar la compra del evento ${eventName} por parte del cliente ${client.username}`);
      logger.error(`POST - BUY EVENT - 400 - No se pudo procesar la compra del evento ${eventName} por parte del cliente ${client.username}`);
      throw new BadRequestException('No se pudo procesar la compra');
    }
  }

  async validateEvent(event, QueryRequestTimeStamp) {
    const eventDate = new Date(event.eventDatesInfo.endDate);

    if (eventDate.getTime() < QueryRequestTimeStamp) {
      logger.error(`POST - BUY EVENT - 400 - El evento ${event.name} ya finalizo`);
      loggerBitacora.error(`POST - BUY EVENT - 400 - El evento ${event.name} ya finalizo`);
      throw new BadRequestException('El evento ya finalizo');
    }

    if(event.statusInfo.status !== EventStatus.APPROVED) {
      logger.error(`POST - BUY EVENT - 400 - El evento ${event.name} no esta aprobado`);
      loggerBitacora.error(`POST - BUY EVENT - 400 - El evento ${event.name} no esta aprobado`);
      throw new BadRequestException(`No se puede comprar el evento ${event.name} ya que el mismo no esta aprobado`);
    }

    return true;
  }

  async confirmPayment(username, eventName, QueryRequestTimeStamp) {
    const client = await this.clientRepository.getByUsername(username);
    if (!client) {
      logger.error(`POST - CONFIRM PAYMENT - 404 - No se encontro el cliente ${username}`);
      loggerBitacora.error(`POST - CONFIRM PAYMENT - 404 - No se encontro el cliente ${username}`);
      throw new NotFoundException('No se encontro el cliente');
    }

    const event = await this.eventRepository.get(eventName);
    if (!event) {
      loggerBitacora.error(`POST - CONFIRM PAYMENT - 404 - No se encontro el evento ${eventName}`);
      logger.error(`POST - CONFIRM PAYMENT - 404 - No se encontro el evento ${eventName}`);
      throw new NotFoundException('No se encontro el evento');
    }

    const updatedEvent = await this.eventRepository.addBuyerToEvent(
      client.id,
      eventName,
    );

    const requestTime = Date.now() - QueryRequestTimeStamp;
    const clientId = client.id

    loggerBitacora.info(`POST - CONFIRM PAYMENT - 200 - Se confirmo el pago del evento ${eventName} por parte del cliente ${username}`);
    logger.info(`POST - CONFIRM PAYMENT - 200 - Se confirmo el pago del evento ${eventName} por parte del cliente ${username}`);

    queriesQueue.enqueueTask(
      { eventName, clientId, requestTime, QueryRequestTimeStamp},
      Action.ADD_BUYER_TO_EVENT,
    );

    return updatedEvent;
  }

  async lookUpEvents() {
    const events = await this.eventRepository.getAll();
    logger.info('GET - LOOK UP EVENTS - 200 - Se obtuvieron todos los eventos de forma correcta');
    return events;
  }

  async consumeEvent(eventId, startRequestTimeStamp) {
    const event = await this.eventRepository.getById(eventId);

    if (!event) {
      logger.error(`POST - CONSUME EVENT - 404 - No se encontro el evento ${eventId}`);
      loggerBitacora.error(`POST - CONSUME EVENT - 404 - No se encontro el evento ${eventId}`);
      throw new NotFoundException('No se encontro el evento');
    }

    const isOnDate = await this.isOnDate(event);

    if (!isOnDate) {
      throw new BadRequestException('El evento no esta en curso');
    }

    if(event.statusInfo.status !== EventStatus.APPROVED) {
      throw new BadRequestException('El evento no esta aprobado');
    }

    const videoPath = path.join(__dirname, '..', event.video);

    const endRequestTimeStamp = Date.now();

    const waitingTime = endRequestTimeStamp - startRequestTimeStamp;


    queryQueue.enqueueTask({
      eventId,
      waitingTime,
    }, ACTION.CONSUME_EVENT);

    return videoPath;
  }

  async isOnDate(event) {
    const today = new Date();

    const eventStartDate = event.eventDatesInfo.startDate;
    const eventEndDate = event.eventDatesInfo.endDate;

    if (today >= eventStartDate && today <= eventEndDate) {
      return true;
    }

    return false;
  }
}

module.exports = ClientService;
