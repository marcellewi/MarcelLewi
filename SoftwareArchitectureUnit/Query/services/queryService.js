const QueryRepository = require('../repositories/queryRepository');
const { EventStatus } = require('../../utils/constants/eventStatus');
const logger = require('../../utils/logger');
const { EventAuthorizationMode } = require('../../utils/constants/eventAuthorizationMode');

class QueryService {
  constructor() {
    this.queryRepository = new QueryRepository();
  }

  async getApprovedEvents(events) {
    let approvedEvents = 0;
    events.forEach((event) => {
      if (event.statusInfo.status === EventStatus.APPROVED) {
        approvedEvents++;
      }
    });
    return approvedEvents;
  }

  async getDisapprovedEvents(events) {
    let disapprovedEvents = 0;
    events.forEach((event) => {
      if (event.statusInfo.status === EventStatus.DISAPPROVED) {
        disapprovedEvents++;
      }
    });
    return disapprovedEvents;
  }

  async getSupplierEvents(supplierId) {
    try {
      const events = await this.queryRepository.getSupplierEvents(supplierId);
      logger.info(
        `GET - GET SUPPLIER EVENTS - 200 - Se obtuvieron los eventos del proveedor con id "${supplierId}" en el Query Service`,
      );
      const response = [];
      if (events) {
        for (const event of events) {
          const eventData = {
            name: event.name,
            status: event.statusInfo.status,
            clientSubs: event.buyers.length,
            averageBuyTime: event.averagePurchaseTime || 0,
            concurrentClients: event.videoConcurrentClients || 0,
            averageVideoTime: event.averageVideoTime || 0,
            emailsSent: event.emails.emailsSent || 0,
            emailsFailed: event.emails.emailsFailed || 0,
          };
          response.push(eventData);
        }
        response.push(
          { approvedEvents: await this.getApprovedEvents(events) },
          { disapprovedEvents: await this.getDisapprovedEvents(events) },
        );
      }

      return response;
    } catch (error) {
      logger.error(
        `GET - GET SUPPLIER EVENTS - 400 - Hubo un error al obtener los eventos del proveedor ${supplier} en el Query Service. Error: ${error.message}`,
      );
      return null;
    }
  }

  async getEvent(ev) {
    try {
      const event = await this.queryRepository.getEvent(ev);
      logger.info(
        `GET - GET EVENT - 200 - Se obtuvo el evento ${event.name} en el Query Service`,
      );
      const eventData = {
        name: event.name,
        clientSubs: event.buyers.length,
        averageBuyTime: event.averagePurchaseTime,
        concurrentClients: event.videoConcurrentClients,
        averageVideoTime: event.averageVideoTime,
        emailsSent: event.emails.emailsSent,
        emailsFailed: event.emails.emailsSent,
      };

      return event ? eventData : null;
    } catch (error) {
      logger.error(
        `GET - GET EVENT - 400 - Hubo un error al obtener el evento con id ${ev} en el Query Service. Error: ${error.message}`,
      );
      return null;
    }
  }

  async getActiveEvents() {
    try {
      const events = await this.queryRepository.getActiveEvents();
      logger.info(
        'GET - GET ACTIVE EVENTS - 200 - Se obtuvieron los eventos activos en el Query Service',
      );
      const response = [];
      if (events) {
        response.push({ activeEventsAmount: events.length });
        for (const event of events) {
          const eventData = {
            name: event.name,
            clientSubs: event.buyers.length,
            videoConcurrentClients: event.videoConcurrentClients,
            averageVideoTime: event.averageVideoTime,
          };
          response.push(eventData);
        }
      }

      return response;
    } catch (error) {
      logger.error(
        `GET - GET ACTIVE EVENTS - 400 - Hubo un error al obtener los eventos activos en el Query Service. Error: ${error.message}`,
      );
      return null;
    }
  }

  async getAdminEvents(startDate, endDate) {
    try {
      const response = [];
      const approvedEvents = await this.queryRepository.getApprovedEventsByAuthMode(startDate, endDate);
      const rejectEvents = await this.queryRepository.getRejectedEvents(startDate, endDate);
      const eventsByAuthModeAmount = {
        autoApprovedEvents: approvedEvents.filter((events) => events._id === EventAuthorizationMode.AUTO).map((events) => events.amount).pop(),
        manualApprovedEvents: approvedEvents.filter((events) => events._id === EventAuthorizationMode.MANUAL).map((events) => events.amount).pop(), 
      };
      const registeredEventsAmount = await this.queryRepository.getRegisteredEvents(startDate, endDate).lenght
      const rejectedEventsAmount = rejectEvents.length;
      const suscriptorsAmount = await this.queryRepository.getSuscriptorsAmount(startDate, endDate);
      const pendingEventsAmount = await this.queryRepository.getPendingEventsAmount(endDate);

      const eventData = {
        approvedEvents,
        rejectedEvents: rejectEvents,
        registeredEventsAmount,
        eventsByAuthModeAmount,
        pendingEventsAmount,
        rejectedEventsAmount,
        suscriptorsAmount,
      };

      response.push(eventData);
      return response;
    } catch (error) {
      logger.error(
        `GET - GET ADMIN EVENTS - 400 - Hubo un error al obtener los eventos del administrador en el Query Service. Error: ${error.message}`,
      );
      return null;
    }
  }

  async getClientEvents(clientId, now) {
    try {
      const events = await this.queryRepository.getClientEvents(clientId, now);
      logger.info(
        `GET - GET CLIENT EVENTS - 200 - Se obtuvieron los eventos del cliente con id ${clientId} en el Query Service`,
      );
      const response = [];
      if (events) {
        for (const event of events) {
          const eventData = {
            name: event.name,
            description: event.description,
            category: event.category,
            startDate: event.eventDatesInfo.startDate,
            endDate: event.eventDatesInfo.endDate,
            price: event.price,
            sucribers: event.buyers.length,
          };
          response.push(eventData);
        }
      }

      return response;
    } catch (error) {
      logger.error(
        `GET - GET CLIENT EVENTS - 400 - Hubo un error al obtener los eventos del cliente ${client} en el Query Service. Error: ${error.message}`,
      );
      return null;
    }
  }
}

module.exports = QueryService;
