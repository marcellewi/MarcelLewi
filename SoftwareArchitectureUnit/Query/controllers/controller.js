const { HttpErrorCodes, evalException } = require('../exceptions/exceptions');
const AuthService = require('../services/authService');
const QueryService = require('../services/queryService');

class QueryController {
  constructor() {
    this.queryService = new QueryService();
    this.authService = new AuthService();
  }

  async getSupplierEvents(req, res) {
    try {
      const QueryRequestTimeStamp = Date.now();
      const auth = req.headers.authorization;

      const supplierId = await this.authService.AuthUser(auth);
      const events = await this.queryService.getSupplierEvents(supplierId);

      const response = {};
      response.events = events;
      response.requestTime = QueryRequestTimeStamp;
      response.responseTime = Date.now();
      response.processingTime = `${response.responseTime - QueryRequestTimeStamp}ms`;
      return res.status(HttpErrorCodes.HTTP_200_OK).send(response);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async getEvent(req, res) {
    try {
      const QueryRequestTimeStamp = Date.now();
      const { eventId } = req.params;

      const ev = await this.queryService.getEvent(eventId);

      const response = {};
      response.event = ev;
      response.requestTime = QueryRequestTimeStamp;
      response.responseTime = Date.now();
      response.processingTime = `${response.responseTime - QueryRequestTimeStamp}ms`;
      return res.status(HttpErrorCodes.HTTP_200_OK).send(response);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async getActiveEvents(req, res) {
    try {
      const QueryRequestTimeStamp = Date.now();

      const events = await this.queryService.getActiveEvents();

      const response = {};
      response.events = events;
      response.requestTime = QueryRequestTimeStamp;
      response.responseTime = Date.now();
      response.processingTime = `${response.responseTime - QueryRequestTimeStamp}ms`;
      return res.status(HttpErrorCodes.HTTP_200_OK).send(response);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async getAdminEvents(req, res) {
    try {
      const QueryRequestTimeStamp = Date.now();
      const { startDate, endDate } = req.query;

      const events = await this.queryService.getAdminEvents(startDate, endDate);

      const response = {};
      response.events = events;
      response.requestTime = QueryRequestTimeStamp;
      response.responseTime = Date.now();
      response.processingTime = `${response.responseTime - QueryRequestTimeStamp}ms`;
      return res.status(HttpErrorCodes.HTTP_200_OK).send(response);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async getClientEvents(req, res) {
    try {
      const QueryRequestTimeStamp = Date.now();
      const auth = req.headers.authorization;

      const clientId = await this.authService.AuthUser(auth);
      const events = await this.queryService.getClientEvents(clientId, QueryRequestTimeStamp);

      const response = {};
      response.events = events;
      response.requestTime = QueryRequestTimeStamp;
      response.responseTime = Date.now();
      response.processingTime = `${response.responseTime - QueryRequestTimeStamp}ms`;
      return res.status(HttpErrorCodes.HTTP_200_OK).send(response);
    } catch (err) {
      return evalException(err, res);
    }
  }
}

module.exports = QueryController;
