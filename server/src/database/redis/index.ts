import { moduleLogger } from '@sliit-foss/module-logger';
import { LockOptions, default as Redis } from 'ioredis';
import { default as Redlock } from 'redlock';

const logger = moduleLogger('Redis');

export const redis = new Redis(process.env.REDIS_CONNECTION_STRING);

export const redlock = new Redlock([redis as any], { retryCount: 20 });

export const speedlock = new Redlock([redis as any], { retryCount: 10 });

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error(`Redis error - message: ${err.message}`, err));

redis.setKey = redis.set;

redis.set = (key: string, value: string | number, ttl?: number) => redis.setKey(key, value.toString(), 'EX', ttl ?? 30);

redis.lockdown = async <T>(
  key: string | string[],
  fn: (lock: Redlock.Lock) => Promise<T>,
  options?: LockOptions
): Promise<T> => {
  const keys = Array.isArray(key) ? key : [key];
  const lock = await redlock
    .acquire(keys, options?.duration ?? 10000)
    .then((result) => {
      logger.info(`Acquired lock for keys: ${keys.join(', ')}`);
      return result;
    })
    .catch((e) => {
      logger.info(`Lock already acquired for one of keys: ${keys.join(', ')} - message: ${e.message}`);
      options?.onAcquisitionError?.(key, e);
      throw e;
    });
  return fn(lock).finally(async () => {
    if (options?.unlockListener) {
      await options.unlockListener(key, lock);
    } else {
      await lock.unlock().then(() => logger.info(`Lock released for key: ${key}`));
    }
  });
};

redis.unlock = async (lock?: Redlock.Lock | Redlock.Lock[]) => {
  if (lock) {
    if (Array.isArray(lock)) {
      await Promise.all(lock.map((l) => l.unlock()));
    } else {
      await lock.unlock();
    }
  }
};

const preserve = async (key: string, fn: Function, ttl: number = 30, json = false): Promise<any> => {
  const value = await redis.get(key)?.catch(() => null);
  if (value) {
    if (json) {
      return JSON.parse(value);
    }
    return value;
  }
  const result = await fn();
  await redis.set(key, json ? JSON.stringify(result) : result, ttl).catch(() => null);
  return result;
};

redis.preserve = (key: string, fn: Function, ttl: number = 30): Promise<any> => {
  return preserve(key, fn, ttl);
};

redis.preserveJSON = (key: string, fn: Function, ttl: number = 30): Promise<any> => {
  return preserve(key, fn, ttl, true);
};

export { Redis, Redlock };

export default { redis, redlock, speedlock, Redis, Redlock };
