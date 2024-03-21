module.exports.initServer = async function () {
  const express = require('express');
  const paymentGatewayRouter = require('./PaymentGateway/router');
  const regulatoryUnityRouter = require('./RegulatoryUnity/router');
  const dotenv = require('dotenv');
  const env = dotenv.config().parsed;

  const app = express();
  const port = env.PORT;

  const logger = require('../utils/logger');

  app.use(express.json());
  app.use(paymentGatewayRouter);
  app.use(regulatoryUnityRouter);

  app.listen(port, () => {
    logger.info(`External APIs server is up on port ${port}`);
  });
};
