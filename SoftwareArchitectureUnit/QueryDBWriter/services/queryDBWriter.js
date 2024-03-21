const QueryRepository = require('../repositories/queryRepository');
const Action = require('../../utils/constants/QueryActions');
const { EventStatus } = require('../../utils/constants/eventStatus');
const logger = require('../../utils/logger');
const { EventAuthorizationMode } = require('../../utils/constants/eventAuthorizationMode');

class QueryDBWriterService {
  constructor() {
    this.queryRepository = new QueryRepository();
  }

  async updateDatabase(job) {
    switch (job.task) {
      case Action.CREATE_EVENT:
        return this.CreateEvent(job.taskData);
      case Action.CREATE_SUPPLIER:
        return this.CreateSupplier(job.taskData);
      case Action.UPDATE_EVENT:
        return this.UpdateEvent(job.taskData);
      case Action.ADD_BUYER_TO_EVENT:
        return this.AddBuyerToEvent(job.taskData);
      case Action.CONSUME_EVENT:
        return this.ConsumeEvent(job.taskData);
      default:
        return null;
    }
  }

  async CreateEvent(data) {
    try {
      this.queryRepository.createEvent(data);
      logger.info(
        `POST - CREATE EVENT - 200 - Se creó el evento ${data.name} en el Query Service`,
      );
    } catch (error) {
      logger.error(
        `POST - CREATE EVENT - 400 - Hubo un error al crear el evento ${data.name} en el Query Service`,
      );
    }
  }

  async UpdateEvent(data) {
    try {
      this.queryRepository.updateEvent(data);
      logger.info(
        `PUT - UPDATE EVENT - 200 - Se actualizó el evento ${data.name} en el Query Service`,
      );
    } catch (error) {
      logger.error(
        `PUT - UPDATE EVENT - 400 - Hubo un error al actualizar el evento ${data.name} en el Query Service`,
      );
    }
  }

  async AddBuyerToEvent(data) {
    try {
      this.queryRepository.addBuyerToEvent(data);
      logger.info(
        `POST - ADD BUYER TO EVENT - 200 - Se agregó un comprador al evento ${data.eventName} en el Query Service`,
      );
    } catch (error) {
      logger.error(
        `POST - ADD BUYER TO EVENT - 400 - Hubo un error al agregar un comprador al evento ${data.eventName} en el Query Service`,
      );
    }
  }

  async CreateSupplier(data) {
    try {
      this.queryRepository.createSupplier(data);
      logger.info(
        `POST - CREATE SUPPLIER - 200 - Se creó el proveedor ${data.username} en el Query Service`,
      );
    } catch (error) {
      logger.error(
        `POST - CREATE SUPPLIER - 400 - Hubo un error al crear el proveedor ${data.username} en el Query Service`,
      );
    }
  }

  async ConsumeEvent(data) {
    try {
      const { eventId } = data;
      const event = await this.queryRepository.getEvent(eventId);
      this.queryRepository.consumeEvent(data);
      logger.info(
        `POST - CONSUME EVENT - 200 - Se registro el tiempo de consumo del evento ${event.name} en el Query Service`,
      );
    } catch (error) {
      logger.error(
        'POST - CONSUME EVENT - 400 - Hubo un error al consumir el evento en el Query Service',
      );
    }
  }
}

module.exports = QueryDBWriterService;
