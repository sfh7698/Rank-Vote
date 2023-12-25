import IORedis, { Redis, RedisOptions } from 'ioredis';
import { config } from './config';
import { errorLogger, generalLogger } from '../utils/loggers';

const connectionOptions: RedisOptions = {
    host: config.redisHost,
    port: config.redisPort
};

const redisClient: Redis = new IORedis(connectionOptions);

redisClient.on('connect', () => {
    generalLogger.info(`Connected to Redis on ${redisClient.options.host}:${redisClient.options.port}`);
});
  
redisClient.on('error', (err) => {
    errorLogger.error('Redis connection error:', err);
});

// redisClient.on('ready', () => {
//     generalLogger.info('Redis client is ready');
// });

export default redisClient;
