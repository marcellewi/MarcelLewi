const axios = require('axios');
const { Roles } = require('../../utils/constants/roles');

const SupplierRepository = require('../repositories/supplierRepository');
const { BadRequestException, evalException } = require('../exceptions/exceptions');

const logger = require('../../utils/logger');

const queryQueue = require('../Queue/queriesQueue');
const Action = require('../../utils/constants/QueryActions');

module.exports = class SupplierService {
  constructor() {
    this.supplierRepository = new SupplierRepository();
  }

  async createSupplier(supplierData) {
    const data = supplierData;
    const newSupplier = await this.supplierRepository.create(data);
    await axios.post('http://localhost:3001/auth/register', {
      _id: newSupplier._id,
      username: data.username,
      password: data.password,
      role: Roles.SUPPLIER,
    });

    logger.info(`POST - CREATE SUPPLIER - 200 - Se creo un proveedor con el nombre ${supplierData.username}`);
    queryQueue.enqueueTask(newSupplier, Action.CREATE_SUPPLIER);
    return newSupplier;
  }
};
