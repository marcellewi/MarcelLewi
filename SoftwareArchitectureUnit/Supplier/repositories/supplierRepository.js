const Supplier = require('../models/supplier');

class SupplierRepository {
  async get(id) {
    const supplier = await Supplier.findById(id);
    return supplier;
  }
}

module.exports = SupplierRepository;
