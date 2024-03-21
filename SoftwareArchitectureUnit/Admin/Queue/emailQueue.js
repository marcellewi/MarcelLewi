const Queue = require('bull');
const redis = require('redis');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const redisClient = redis.createClient({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT_EMAIL,
});
const queue = new Queue('emailQueue', { redis: redisClient });
redisClient.connect(env.REDIS_PORT_EMAIL);

console.log(`Connecting to Redis: ${env.REDIS_HOST}:${env.REDIS_PORT_EMAIL}`);

module.exports = {
  enqueueTask: async (taskData) => {
    try {
      queue.add(taskData);
      return true;
    } catch (error) {
      console.error('Error al encolar la tarea:', error);
      return false;
    }
  },
};
