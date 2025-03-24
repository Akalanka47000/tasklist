import { Request, Response } from 'express';
import { default as rateLimit } from 'express-rate-limit';
import { headers } from '@shared/constants';
import { default as RedisStore } from 'rate-limit-redis';
import { default as requestIp } from 'request-ip';

const options = {
  windowMs: 1 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  max: 120,
  message: (_req: Request, res: Response) =>
    res.status(429).json({
      message: `Too many requests`
    }),
  skip: (req: Request) =>
    process.env.SERVICE_REQUEST_KEY && req.headers[headers.serviceRequestKey] === process.env.SERVICE_REQUEST_KEY,
  keyGenerator: (req: Request) => requestIp.getClientIp(req),
  store: undefined
};

if (process.env.REDIS_CONNECTION_STRING && !process.env.USE_IN_MEMORY_RATE_LIMITER) {
  const { redis } = require('@/database/redis').default;
  options.store = new RedisStore({
    sendCommand: (...args) => redis.call(...args)
  });
}

export const rateLimiter = rateLimit(options);
