const axios = require('axios');
const { NotFoundException } = require("../exceptions/exceptions");
const clientRepository = require('../repositories/clientRepository');

class AuthService {
  constructor() {
    this.userRepository = new clientRepository();
  }

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
    const user = await this.userRepository.get(data.id);
    return user;
  }
}

module.exports = AuthService;
