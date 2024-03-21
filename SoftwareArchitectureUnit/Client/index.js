const Server = require('./server');
const Repository = require('./repositories/repository');
const logger = require('../utils/logger');

(async () => {
  try {
    await Repository.initRepository();
    await Server.initServer();
  } catch (err) {
    logger.error(`Error initializing repository: ${err}`);
    process.exit(1);
  }
})();
