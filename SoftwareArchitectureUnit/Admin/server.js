module.exports.initServer = async function () {
  const express = require('express');
  const adminRouter = require('./controllers/router');
  const dotenv = require('dotenv');
  const env = dotenv.config().parsed;

  const app = express();
  const port = env.PORT;

  const logger = require('../utils/logger');

  app.use(express.json());
  app.use(adminRouter);

  app.listen(port, () => {
    logger.info(`Admin server is up on port ${port}`);
  });
};
