const Queue = require('bull');
const redis = require('redis');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const PaymentGatewayAdapter = require('../PaymentGatewayAdapter');

const payment = new PaymentGatewayAdapter();

const redisClient = redis.createClient({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT_PAYMENT,
});

const queue = new Queue('paymentQueue', {
  redis: redisClient,
});

console.log('Connected to the Queue');

queue.process((job) => {
  payment.makePaymentRequest(job.data);
});

class RedisQueue {
  static async initQueue() {
    console.log(`Connecting to Redis: ${env.REDIS_HOST}:${env.REDIS_PORT_PAYMENT}`);
    try {
      console.log('Connected to the Queue');
    } catch (error) {
      console.error('Error connecting to Queue:', error);
    }
  }
}

module.exports = RedisQueue;
