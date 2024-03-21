const axios = require('axios');
const { evalException, NotFoundException, UnauthorizeException } = require('../exceptions/exceptions');
const queryRepository = require('../repositories/queryRepository');

const eventQueryRepository = new queryRepository();

async function eventSupplierAuth(req, res, next) {
  const { eventId } = req.params;
  const event = await eventQueryRepository.getEvent(eventId);
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
