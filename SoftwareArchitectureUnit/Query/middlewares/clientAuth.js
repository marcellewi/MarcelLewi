const axios = require('axios');
const { Roles } = require('../../utils/constants/roles');
const {
  evalException,
  BadRequestException,
} = require('../exceptions/exceptions');

async function clientAuth(req, res, next) {
  try {
    const authorization = req.header('Authorization');
    const role = Roles.CLIENT;

    if (!authorization) {
      throw new BadRequestException('Token no proporcionado');
    }
    if (role === undefined) {
      throw new BadRequestException('Rol no proporcionado');
    }

    await axios.get('http://localhost:3001/auth/verifyToken', {
      params: { role },
      headers: { Authorization: authorization },
    });

    return next();
  } catch (error) {
    return evalException(error, res);
  }
}

module.exports = clientAuth;
