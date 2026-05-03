import { NextFunction } from 'express';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.PD_REDIS_HOST || 'localhost',
  port: parseInt(process.env.PD_REDIS_PORT || '6379', 10),
});

export function rateLimit(options: { max: number; windowMs: number }) {
  return async (req: MedusaRequest, res: MedusaResponse, next: NextFunction) => {
    try {
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
      const key = `pd_ratelimit:${ip}`;
      
      const count = await redis.incr(key);
      let ttl = await redis.pttl(key);
      
      if (count === 1 || ttl === -1) {
        await redis.pexpire(key, options.windowMs);
        ttl = options.windowMs;
      }

      res.setHeader('X-RateLimit-Limit', options.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - count));
      res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + ttl) / 1000));

      if (count > options.max) {
        res.status(429).json({
          type: 'RateLimitError',
          message: 'Too many requests, please try again later.',
          code: 'PD_RATE_LIMIT_EXCEEDED'
        });
        return;
      }

      next();
    } catch (error) {
      // If Redis fails, gracefully fail open to not block traffic
      next();
    }
  };
}

export const publicRateLimit = rateLimit({ max: 100, windowMs: 60 * 1000 }); // 100 req per minute
export const authRateLimit = rateLimit({ max: 60, windowMs: 60 * 1000 }); // 60 req per minute
