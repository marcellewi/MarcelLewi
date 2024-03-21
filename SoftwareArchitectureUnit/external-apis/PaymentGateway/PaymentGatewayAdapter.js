const axios = require('axios');
const ServiceEmulator = require('./seviceEmulator');

const emailQueue = require('./Queue/emailQueue');

const logger = require('../../utils/logger');
const { HttpErrorCodes, evalException } = require('../exceptions/exceptions');

class PaymentGatewayAdapter {
  constructor() {
    this.paymentService = new ServiceEmulator();
  }

  async getAuthorizedUser(req, res) {
    try {
      const response = await this.paymentService.getAuthorizedUser();
      logger.info(
        'GET - GET AUTHORIZED USER PAYMENT GATEWAY - 200 - User authorized',
      );
      return res.status(HttpErrorCodes.HTTP_200_OK).json(response);
    } catch (error) {
      logger.error(
        `GET - GET AUTHORIZED USER PAYMENT GATEWAY - ${error.status} - ${error.message}`,
      );
      return evalException(error, res);
    }
  }

  async makePaymentRequest(paymentData) {
    try {
      const paymentDone = await this.paymentService.makePayment(paymentData);

      if (!paymentDone) {
        const email = {
          to: paymentData.email,
          subject: `Error al procesar pago para el evento ${paymentData.event}`,
          text: 'Hubo un error al procesar su pago',
        };
        emailQueue.enqueueTask(email);
        logger.error(
          `POST - MAKE PAYMENT - 400 - Error while trying to make payment. Email sent to: ${paymentData.email} for event ${paymentData.event}`,
        );
      } else {
        const confirmPayment = await axios.post(
          'http://localhost:3002/client/confirmPayment',
          {
            username: paymentData.name,
            eventName: paymentData.event,
            QueryRequestTimeStamp: paymentData.requestTime,
          },
        );
        if (confirmPayment.status !== 200) {
          logger.error(
            `POST - CONFIRM PAYMENT - 400 - Payment was done for ${paymentData.email} but there was an error while trying to confirm it for event ${paymentData.event}`,
          );
        } else {
          const email = {
            to: paymentData.email,
            subject: `Pago confirmado para el evento ${paymentData.event}`,
            text: 'Su pago ha sido confirmado',
          };
          emailQueue.enqueueTask(email);
          logger.info(
            `POST - CONFIRM PAYMENT - 200 - Payment was done for ${paymentData.email} and confirmed for event ${paymentData.event}`,
          );
        }
      }
    } catch (error) {
      logger.error(
        `POST - MAKE PAYMENT - 400 - Error while trying to make payment ${paymentData.email} for event ${paymentData.event}: Error: ${error.message} `,
      );
      const email = {
        to: paymentData.email,
        subject: `Error al procesar pago para el evento ${paymentData.event}`,
        text: 'Hubo un error al procesar su pago',
      };
      emailQueue.enqueueTask(email);
    }
  }
}

module.exports = PaymentGatewayAdapter;
