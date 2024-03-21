const Supplier = require('../models/supplier');

module.exports = class SupplierRepository {
  constructor() {
    this.supplier = Supplier;
  }

  async get(username) {
    try {
      const supplier = await Supplier.findOne({ username });
      return supplier || null;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async create(data) {
    const newUser = await Supplier.create(data);
    return newUser;
  }
};
