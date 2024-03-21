const { default: axios } = require('axios');
const { evalException, UnauthorizeException, NotFoundException } = require('../exceptions/exceptions');
const EventRepository = require('../repositories/eventRepository');

const eventRepository = new EventRepository();
const ClientRepository = require('../repositories/clientRepository');

const clientRepository = new ClientRepository();

async function verifyPayment(req, res, next) {
  try {
    const { eventId } = req.params;
    const event = await eventRepository.getById(eventId);
    const authorization = req.header('Authorization');

    if (!event) {
      throw new NotFoundException('Token no proporcionado');
    }

    const { data } = await axios.get(
      'http://localhost:3001/auth/getLoggedUser',
      {
        headers: {
          Authorization: authorization,
        },
      },
    );

    const hasPaid = event.buyers.some((buyer) => buyer.client.toString() === data.id);

    if (!hasPaid) {
      throw new UnauthorizeException('No has pagado por este evento');
    }

    next();
  } catch (error) {
    return evalException(error, res);
  }
}

module.exports = verifyPayment;
