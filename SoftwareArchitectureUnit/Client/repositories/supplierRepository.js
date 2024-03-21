const Supplier = require('../models/supplier');

class supplierRepository {
  async get(username) {
    const supp = await Supplier.findOne({ username });
    return supp;
  }
}

module.exports = supplierRepository;
