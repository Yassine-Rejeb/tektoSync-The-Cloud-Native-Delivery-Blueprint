import dotenv from 'dotenv';
import { Redis } from 'ioredis';

dotenv.config()

//Create a config object for the redis client
const redisConfig: any = {
  username: process.env.REDIS_SERVICE_USERNAME || process.env['redis_username'] || undefined,
  password: process.env.REDIS_SERVICE_PASSWORD || process.env['redis_password'] || undefined,
  port: process.env.REDIS_SERVICE_PORT || process.env['redis_port'] || 6379,
  host: process.env.REDIS_SERVICE_HOST || process.env['redis_host'] || 'localhost'
}

console.log('Redis Confif', redisConfig);

// Create the Redis Instance
let redis: any;

export const cacheConfig = async () => {
  redis = await new Redis(redisConfig);

  redis.on('connect', () => {
    console.log('Redis Connected');
  });

  redis.on('error', (err: any) => {
    console.log('redis error', err);
  });
};

export const getClient = async () => {
  if (!redis) {
    await cacheConfig();
    return redis;
  } else {
    return redis;
  }
}