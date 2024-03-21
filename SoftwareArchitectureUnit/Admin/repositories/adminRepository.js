const Admin = require('../models/admin');

module.exports = class AdminRepository {
  constructor() {
    this.admin = Admin;
  }

  async get(id) {
    const admin = await Admin.findById(id);
    return admin || null;
  }

  async create(data) {
    const newUser = await Admin.create({ username: data.username, email: data.email });
    return newUser;
  }
};
