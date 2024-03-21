const Client = require('../models/client');

class clientRepository {
  async get(id) {
    const client = await Client.findById(id);
    return client;
  }

  async getByUsername(username) {
    const client = await Client.findOne({ username });
    return client;
  }

  async createClient(username, birthday, country, email) {
    const newClient = await new Client({
      username,
      birthday,
      country,
      email,
    });
    await newClient.save();
    return newClient;
  }
}

module.exports = clientRepository;
