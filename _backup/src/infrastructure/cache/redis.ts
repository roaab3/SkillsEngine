import { createClient, RedisClientType } from 'redis';
import { logger } from '../logger/logger';

let redisClient: RedisClientType | null = null;

export async function connectRedis(): Promise<void> {
  try {
    if (!process.env.REDIS_URL) {
      logger.warn('Redis URL not configured, skipping Redis connection');
      return;
    }

    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (error) => {
      logger.error('Redis client error:', error);
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    redisClient.on('end', () => {
      logger.info('Redis client disconnected');
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Error connecting to Redis:', error);
    throw error;
  }
}

export async function getFromCache(key: string): Promise<string | null> {
  try {
    if (!redisClient) {
      return null;
    }

    const value = await redisClient.get(key);
    return value;
  } catch (error) {
    logger.error('Error getting from cache:', error);
    return null;
  }
}

export async function setCache(key: string, value: string, ttlSeconds?: number): Promise<void> {
  try {
    if (!redisClient) {
      return;
    }

    if (ttlSeconds) {
      await redisClient.setEx(key, ttlSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    logger.error('Error setting cache:', error);
  }
}

export async function deleteFromCache(key: string): Promise<void> {
  try {
    if (!redisClient) {
      return;
    }

    await redisClient.del(key);
  } catch (error) {
    logger.error('Error deleting from cache:', error);
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient) {
      await redisClient.disconnect();
      logger.info('Redis disconnected successfully');
    }
  } catch (error) {
    logger.error('Error disconnecting from Redis:', error);
    throw error;
  }
}

