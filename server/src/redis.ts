import Redis from 'ioredis';
import { errorLogger, generalLogger } from './utils/loggers.js';

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redisClient.on('connect', () => {
    generalLogger.info(`Connected to Redis on ${redisClient.options.host}:${redisClient.options.port}`);
});
  
redisClient.on('error', (err) => {
    errorLogger.error('Redis connection error:', err);
});

redisClient.on('ready', () => {
    generalLogger.info('Redis client is ready');
});

export default redisClient;
