const fs = require('fs');
const {
  HttpErrorCodes, evalException, BadRequestException, NotFoundException,
} = require('../exceptions/exceptions');
const ClientService = require('../services/clientService');

class ClientController {
  constructor() {
    this.clientService = new ClientService();
  }

  async register(req, res) {
    try {
      const {
        username, birthday, country, email, password,
      } = req.body;

      const newClient = await this.clientService.register(username, birthday, country, email, password);
      return res.status(HttpErrorCodes.HTTP_200_OK).send(newClient);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async buyEvent(req, res) {
    try {
      const QueryRequestTimeStamp = Date.now();
      const auth = req.headers.authorization;

      const { eventName, supplierName } = req.body;

      if (!eventName || !supplierName) {
        throw new BadRequestException('Debe proporcionar un cliente, proveedor y evento');
      }

      const event = await this.clientService.buyEvent(auth, eventName, supplierName, QueryRequestTimeStamp);
      return res.status(HttpErrorCodes.HTTP_200_OK).send(event);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async confirmPayment(req, res) {
    try {
      const { username, eventName, QueryRequestTimeStamp } = req.body;

      if (!username || !eventName) {
        throw new BadRequestException('Debe proporcionar un cliente y evento');
      }

      const event = await this.clientService.confirmPayment(username, eventName, QueryRequestTimeStamp);

      return res.status(200).send(event);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async lookUpEvents(req, res) {
    try {
      const events = await this.clientService.lookUpEvents();
      return res.status(HttpErrorCodes.HTTP_200_OK).send(events);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async consumeEvent(req, res, startRequestTimeStamp) {
    try {
      const { eventId } = req.params;
      const videoPath = await this.clientService.consumeEvent(eventId, startRequestTimeStamp);

      fs.access(videoPath, fs.constants.F_OK, (err) => {
        if (err) {
          throw new NotFoundException('No se encontro el video');
        }

        const result = res.status(HttpErrorCodes.HTTP_200_OK).sendFile(videoPath);

        return result;
      });
    } catch (err) {
      return evalException(err, res);
    }
  }
}

module.exports = ClientController;
