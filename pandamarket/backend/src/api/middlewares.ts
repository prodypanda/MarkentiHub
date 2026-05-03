// pandamarket/backend/src/api/middlewares.ts
// =============================================================================
// PandaMarket — Global HTTP Middleware Registry
// Order matters: Helmet → Rate limit → Auth → Route handler.
// The last-registered middleware array is executed as a chain per request.
// =============================================================================

import { defineMiddlewares } from '@medusajs/framework/http';
import helmet from 'helmet';

import { authenticateApiKey } from './middlewares/api-key';
import { authenticateVendor } from './middlewares/authenticate-vendor';
import { requireAdmin } from './middlewares/require-admin';
import { validateUpload } from './middlewares/upload-validation';
import {
  publicRateLimit,
  authRateLimit,
  apiKeyRateLimit,
  loginRateLimit,
  registerRateLimit,
  uploadRateLimit,
} from './middlewares/rate-limit';

export default defineMiddlewares({
  routes: [
    // ─── Security headers on ALL PD routes ─────────────────────────────────
    {
      matcher: '/api/pd/*',
      middlewares: [helmet()],
    },

    // ─── Public rate limit default for all /api/pd/* ────────────────────────
    // (Overridden below by stricter limits where applicable.)
    {
      matcher: '/api/pd/*',
      method: 'GET',
      middlewares: [publicRateLimit],
    },

    // ─── Auth endpoints (stricter) ─────────────────────────────────────────
    {
      matcher: '/api/pd/auth/login',
      method: 'POST',
      middlewares: [loginRateLimit],
    },
    {
      matcher: '/api/pd/auth/register',
      method: 'POST',
      middlewares: [registerRateLimit],
    },
    {
      matcher: '/api/pd/auth/forgot-password',
      method: 'POST',
      middlewares: [registerRateLimit],
    },

    // ─── External Vendor API (pd_sk_* key only) ────────────────────────────
    {
      matcher: '/api/pd/vendor/*',
      middlewares: [apiKeyRateLimit, authenticateApiKey],
    },

    // ─── Admin endpoints (JWT + admin role) ────────────────────────────────
    {
      matcher: '/api/pd/admin/*',
      middlewares: [authRateLimit, authenticateVendor, requireAdmin],
    },

    // ─── Vendor JWT-protected write endpoints ──────────────────────────────
    {
      matcher: '/api/pd/stores',
      method: 'POST',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/stores/:id',
      method: 'PUT',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/stores/:id/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/products',
      method: ['POST'],
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/products/:id',
      method: ['PUT', 'DELETE'],
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/products/:id/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/products/import',
      method: 'POST',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/products/export',
      method: 'GET',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/orders',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/orders/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/wallet',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/wallet/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/credits',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/credits/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/subscriptions/current',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/subscriptions/upgrade',
      method: 'POST',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/subscriptions/downgrade',
      method: 'POST',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/verification',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/verification/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/notifications',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/notifications/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/api-keys',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/api-keys/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/ai/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/reports',
      method: 'POST',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/payments/mandat/upload',
      method: 'POST',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/payments/:gateway/init',
      method: 'POST',
      middlewares: [authRateLimit, authenticateVendor],
    },

    // ─── Presigned URL upload endpoints ────────────────────────────────────
    {
      matcher: '/api/pd/upload/*',
      method: 'POST',
      middlewares: [uploadRateLimit, authenticateVendor, validateUpload],
    },
  ],
});
