const Server = require('./server');
const RedisQueue = require('./Queue/emailQueue');

const logger = require('../utils/logger');

(async () => {
  try {
    await Server.initServer();
    await RedisQueue.initQueue();
  } catch (err) {
    logger.error(`Error initializing server: ${err}`);
    process.exit(1);
  }
})();
