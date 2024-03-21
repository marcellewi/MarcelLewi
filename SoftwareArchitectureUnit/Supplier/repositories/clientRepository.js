const Client = require('../models/client');

class clientRepository {
  async get(id) {
    const client = await Client.findOne(id);
    return client;
  }
}

module.exports = clientRepository;
