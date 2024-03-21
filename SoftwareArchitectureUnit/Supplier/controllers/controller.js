const EventService = require('../services/eventService');
const { HttpErrorCodes, evalException } = require("../exceptions/exceptions");

class SupplierController {
  constructor() {
    this.eventService = new EventService();
  }

  async createEvent(req, res) {
    try {
      const auth = req.headers.authorization;
      const {
        name, description, eventDatesInfo, category, price,
      } = req.body;
      const thumbnail = req.files.thumbnail[0].path
      const mainImage = req.files.mainImage[0].path
      const video = req.files.video[0].path

      const newEvent = await this.eventService.createEvent(
        auth,
        name,
        description,
        price,
        eventDatesInfo,
        category,
        thumbnail,
        mainImage,
        video,
      );
      return res.status(HttpErrorCodes.HTTP_200_OK).send(newEvent);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async editEvent(req, res) {
    try {
      const { eventId } = req.params;
      const {
        name, description, eventDatesInfo, category, price
      } = req.body;
      const thumbnail = req.files.thumbnail && req.files.thumbnail[0].path
      const mainImage = req.files.mainImage && req.files.mainImage[0].path
      const video = req.files.video && req.files.video[0].path


      const updatedEvent = await this.eventService.editEvent(
        eventId,
        name,
        description,
        price,
        eventDatesInfo,
        thumbnail,
        mainImage,
        category,
        video,
      );
      return res.status(HttpErrorCodes.HTTP_200_OK).send(updatedEvent);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async sendEmailToEventBuyers(req, res) {
    try {
      const { eventId } = req.params;
      const { message } = req.body;

      await this.eventService.sendEmailToEventBuyers(
        eventId,
        message,
      );

      return res.status(HttpErrorCodes.HTTP_200_OK).json({ message: 'Email sent successfully' });
    } catch (err) {
      return evalException(err, res);
    }
  }

  async confirmEmailSent(req, res) {
    try {
      const { eventId, emailSent } = req.body;

      await this.eventService.confirmEmailSent(eventId, emailSent);

      return res.status(HttpErrorCodes.HTTP_200_OK).json({ message: 'Email sent successfully' });
    } catch (err) {
      return evalException(err, res);
    }
  }
}

module.exports = SupplierController;
