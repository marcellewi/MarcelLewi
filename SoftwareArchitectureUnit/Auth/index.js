const { initServer } = require('./server');
const { connectToMongoDatabase } = require('./repositories/repository');

(async () => {
  await connectToMongoDatabase();
  initServer();
})();
