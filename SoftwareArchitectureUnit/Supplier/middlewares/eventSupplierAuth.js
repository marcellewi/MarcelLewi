const axios = require('axios');
const EventRepository = require('../repositories/eventRepository');
const SupplierRepository = require('../repositories/supplierRepository');
const { evalException, NotFoundException, UnauthorizeException } = require('../exceptions/exceptions');

const supplierRepository = new SupplierRepository();
const eventRepository = new EventRepository();

async function eventSupplierAuth(req, res, next) {
  const { eventId } = req.params;
  const event = await eventRepository.getEvent(eventId);
  const authorization = req.header('Authorization');

  if (!event) {
    throw new NotFoundException('Token no proporcionado');
  }

  try {
    const { data } = await axios.get(
      'http://localhost:3001/auth/getLoggedUser',
      {
        headers: {
          Authorization: authorization,
        },
      },
    );

    if (data.id === event.supplier.id) {
      return next();
    }

    throw new UnauthorizeException('Usuario no habilitado');
  } catch (error) {
    return evalException(error, res);
  }
}

module.exports = eventSupplierAuth;
