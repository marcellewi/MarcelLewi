const axios = require('axios');
const AdminRepository = require('../repositories/adminRepository');

class AuthService {
  constructor() {
    this.userRepository = new AdminRepository();
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
    return await this.userRepository.get(data.id);
  }
}

module.exports = AuthService;
