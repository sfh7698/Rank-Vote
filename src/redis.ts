import IORedis, { Redis, RedisOptions } from 'ioredis';
import { config } from './config';

const connectionOptions: RedisOptions = {
    host: config.redisHost,
    port: config.redisPort
};

const redisClient: Redis = new IORedis(connectionOptions);

redisClient.on('connect', () => {
    console.log(`Connected to Redis on ${redisClient.options.host}:${redisClient.options.port}`);
});
  
redisClient.on('error', (err) => {
console.error('Redis connection error:', err);
});

redisClient.on('ready', () => {
console.log('Redis client is ready');
});

export default redisClient;
