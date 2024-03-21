const Queue = require('bull');
const redis = require('redis');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const QueryService = require('../services/queryDBWriter');

const queryService = new QueryService();

const redisClient = redis.createClient({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT_QUERIES,
});

const queue = new Queue('queriesQueue', {
  redis: redisClient,
});

console.log('Connected to the Queue');

queue.process((job) => {
  queryService.updateDatabase(job.data);
});

class RedisQueue {
  static async initQueue() {
    console.log(`Connecting to Redis: ${env.REDIS_HOST}:${env.REDIS_PORT_QUERIES}`);
    try {
      console.log('Connected to the Queue');
    } catch (error) {
      console.error('Error connecting to Queue:', error);
    }
  }
}

module.exports = RedisQueue;
