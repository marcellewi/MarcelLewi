const Queue = require('bull');
const redis = require('redis');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const MessageSenderAdapter = require('../services/messageSenderAdapter');

const messageSender = new MessageSenderAdapter();

const redisClient = redis.createClient({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT_EMAIL,
});

const queue = new Queue('emailQueue', {
  redis: redisClient,
});

console.log('Connected to the Queue');

queue.process((job) => {
  messageSender.sendEmail(job.data);
});

class RedisQueue {
  static async initQueue() {
    console.log(`Connecting to Redis: ${env.REDIS_HOST}:${env.REDIS_PORT_EMAIL}`);
    try {
      console.log('Connected to the Queue');
    } catch (error) {
      console.error('Error connecting to Queue:', error);
    }
  }
}

module.exports = RedisQueue;
