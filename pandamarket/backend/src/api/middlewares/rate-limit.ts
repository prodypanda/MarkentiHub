// pandamarket/backend/src/api/middlewares/rate-limit.ts
// =============================================================================
// PandaMarket — Redis-backed Rate Limiter
// Keyed by authenticated store_id when available, else client IP.
// Gracefully fails open if Redis is unreachable so traffic is never blocked
// by infra outages (logged for monitoring).
// =============================================================================

import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';
import Redis from 'ioredis';

import { RATE_LIMITS } from '../../utils/constants';
import { createServiceLogger } from '../../utils/logger';

const logger = createServiceLogger('RateLimit');

const redis = new Redis({
  host: process.env.PD_REDIS_HOST || 'localhost',
  port: parseInt(process.env.PD_REDIS_PORT || '6379', 10),
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});
redis.on('error', (err) => {
  // Avoid log spam — only at debug. Failures fall open in the middleware.
  logger.debug({ err }, 'Redis connection error (rate-limit)');
});

export interface RateLimitOptions {
  max: number;
  windowMs: number;
  /** Optional prefix to isolate limit buckets across endpoints. */
  prefix?: string;
}

function resolveClientKey(req: MedusaRequest, prefix: string): string {
  const r = req as unknown as { pd_store_id?: string };
  if (r.pd_store_id) {
    return `pd_rl:${prefix}:store:${r.pd_store_id}`;
  }
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress ?? 'unknown';
  return `pd_rl:${prefix}:ip:${ip}`;
}

export function rateLimit(options: RateLimitOptions) {
  const prefix = options.prefix ?? 'default';
  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction,
  ): Promise<void> => {
    try {
      const key = resolveClientKey(req, prefix);

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
          error: {
            code: 'PD_RATE_LIMITED',
            message: 'Trop de requêtes, réessayez plus tard',
            details: { retry_after: Math.ceil(ttl / 1000) },
          },
        });
        return;
      }

      return next();
    } catch (err) {
      logger.warn({ err }, 'Rate limiter failed open due to Redis error');
      return next();
    }
  };
}

export const publicRateLimit = rateLimit({ ...RATE_LIMITS.PUBLIC_API, prefix: 'pub' });
export const authRateLimit = rateLimit({ ...RATE_LIMITS.AUTHENTICATED_API, prefix: 'auth' });
export const apiKeyRateLimit = rateLimit({ ...RATE_LIMITS.API_KEY, prefix: 'apikey' });
export const loginRateLimit = rateLimit({ ...RATE_LIMITS.AUTH_LOGIN, prefix: 'login' });
export const registerRateLimit = rateLimit({ ...RATE_LIMITS.AUTH_REGISTER, prefix: 'register' });
export const uploadRateLimit = rateLimit({ ...RATE_LIMITS.FILE_UPLOAD, prefix: 'upload' });
