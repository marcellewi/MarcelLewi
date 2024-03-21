const {
  HttpErrorCodes,
  evalException,
  BadRequestException,
} = require('../exceptions/exceptions');
const SupplierService = require('../services/supplierService');

module.exports = class SupplierController {
  constructor() {
    this.supplierService = new SupplierService();
  }

  async create(req, res) {
    try {
      const supplier = await this.supplierService.createSupplier(req.body);
      if (!supplier) {
        throw new BadRequestException('No se pudo crear el proveedor');
      }
      return res.status(HttpErrorCodes.HTTP_200_OK).json(supplier);
    } catch (err) {
      return evalException(err, res);
    }
  }
};
