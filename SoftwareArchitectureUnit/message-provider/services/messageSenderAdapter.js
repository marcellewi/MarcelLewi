const nodemailer = require('nodemailer');
const axios = require('axios');

const logger = require('../../utils/logger');

class MessageSenderAdapter {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'marchulew@gmail.com',
        pass: 'xndqujapawvhiokd',
      },
    });
  }

  async sendEmail(data) {
    try {
      // El from tiene que mantenerse igual ya que se precisan
      // credenciales especiales para enviar correos desde Gmail
      // y ya fueron configuradas para este mail
      const mailOptions = {
        from: 'marchulew@gmail.com',
        to: data.to,
        subject: data.subject,
        text: data.text,
      };

      // Envía el correo electrónico utilizando el transportador de Nodemailer
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email ${data.subject} sent to: ${mailOptions.to}. Response: ${info.response}`);

      if (data.isEventEmail) {
        await axios.post('http://localhost:3006/supplier/events/confirmEmailSent', { eventId: data.isEventEmail, emailSent: true });
      }
    } catch (error) {
      logger.error(`Error sending email ${data.subject} sent to: ${data.to}. Error: ${error}`);
      if (data.isEventEmail) {
        await axios.post('http://localhost:3006/supplier/events/confirmEmailSent', { eventId: data.isEventEmail, emailSent: false });
      }
    }
  }
}

module.exports = MessageSenderAdapter;
