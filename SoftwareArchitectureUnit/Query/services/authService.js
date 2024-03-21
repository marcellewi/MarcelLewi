const axios = require('axios');const { NotFoundException } = require("../exceptions/exceptions");

class AuthService {

  async AuthUser(authorization) {
    const { data } = await axios.get(
      'http://localhost:3001/auth/getLoggedUser',
      {
        headers: {
          Authorization: authorization,
        },
      },
    );

    if (!data.id) { throw new NotFoundException('Usuario no encontrado'); }
    return data.id;
  }
}

module.exports = AuthService;
