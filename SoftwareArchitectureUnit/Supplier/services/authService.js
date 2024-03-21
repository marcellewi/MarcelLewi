const axios = require('axios');
const SupplierRepository = require('../repositories/supplierRepository');
const { NotFoundException } = require("../exceptions/exceptions");

class AuthService {
  constructor() {
    this.userRepository = new SupplierRepository();
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
