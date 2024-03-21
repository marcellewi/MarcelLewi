const Server = require('./server');
const RedisQueue = require('./PaymentGateway/Queue/paymentQueue');

const logger = require('../utils/logger');

(async () => {
  try {
    await RedisQueue.initQueue();
    await Server.initServer();
  } catch (err) {
    logger.error(`Error initializing repository: ${err}`);
    process.exit(1);
  }
})();
