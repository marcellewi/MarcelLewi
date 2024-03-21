module.exports.initServer = async function () {
  const express = require('express');
  const supplierRouter = require('./controllers/routes');
  const dotenv = require('dotenv');
  const env = dotenv.config().parsed;

  const app = express();
  const port = env.PORT;

  const logger = require('../utils/logger');

  app.use(express.json());
  app.use(supplierRouter);

  app.listen(port, () => {
    logger.info(`Auth server is up on port ${port}`);
  });
};
