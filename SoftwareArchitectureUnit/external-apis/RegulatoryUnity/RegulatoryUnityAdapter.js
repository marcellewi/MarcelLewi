const ServiceEmulator = require('./seviceEmulator');

const logger = require('../../utils/logger');
const { HttpErrorCodes, evalException } = require('../exceptions/exceptions');

class RegulatoryUnityAdapter {
  constructor() {
    this.regulatorySevice = new ServiceEmulator();
  }

  async getAuthorizedUser(req, res) {
    try {
      const response = await this.regulatorySevice.getAuthorizedUser();
      logger.info(
        'GET - GET AUTHORIZED USER REGULATORY UNITY - 200 - User authorized',
      );
      return res.status(HttpErrorCodes.HTTP_200_OK).json(response);
    } catch (error) {
      logger.error(
        `GET - GET AUTHORIZED USER REGULATORY UNITY - ${error.status} - ${error.message}`,
      );
      return evalException(error, res);
    }
  }
}

module.exports = RegulatoryUnityAdapter;
