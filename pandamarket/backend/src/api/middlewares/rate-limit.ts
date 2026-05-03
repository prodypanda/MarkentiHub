import { NextFunction } from 'express';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (for a distributed setup, replace with Redis)
const store = new Map<string, RateLimitInfo>();

export function rateLimit(options: { max: number; windowMs: number }) {
  return (req: MedusaRequest, res: MedusaResponse, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Simple garbage collection
    if (Math.random() < 0.05) {
      for (const [key, info] of store.entries()) {
        if (now > info.resetTime) store.delete(key);
      }
    }

    let info = store.get(ip);

    if (!info || now > info.resetTime) {
      info = { count: 0, resetTime: now + options.windowMs };
    }

    info.count++;
    store.set(ip, info);

    res.setHeader('X-RateLimit-Limit', options.max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - info.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(info.resetTime / 1000));

    if (info.count > options.max) {
      res.status(429).json({
        type: 'RateLimitError',
        message: 'Too many requests, please try again later.',
        code: 'PD_RATE_LIMIT_EXCEEDED'
      });
      return;
    }

    next();
  };
}

export const publicRateLimit = rateLimit({ max: 100, windowMs: 60 * 1000 }); // 100 req per minute
export const authRateLimit = rateLimit({ max: 60, windowMs: 60 * 1000 }); // 60 req per minute
