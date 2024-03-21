const Queue = require('bull');
const redis = require('redis');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const redisClient = redis.createClient({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT_QUERIES,
});
const queue = new Queue('queriesQueue', { redis: redisClient });
redisClient.connect(env.REDIS_PORT_QUERIES);

console.log(`Connecting to Redis: ${env.REDIS_HOST}:${env.REDIS_PORT_QUERIES}`);

module.exports = {
  enqueueTask: async (taskData, task) => {
    try {
      queue.add({ taskData, task });
      return true;
    } catch (error) {
      console.error('Error al encolar la tarea:', error);
      return false;
    }
  },
};
