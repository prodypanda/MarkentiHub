import { defineMiddlewares } from '@medusajs/framework/http';
import helmet from 'helmet';
import { authenticateApiKey } from './middlewares/api-key';
import { authenticateVendor } from './middlewares/authenticate-vendor';
import { authenticateAdmin } from './middlewares/authenticate-admin';
import { validateUpload } from './middlewares/upload-validation';
import { publicRateLimit, authRateLimit } from './middlewares/rate-limit';

export default defineMiddlewares({
  routes: [
    {
      // Apply Helmet globally to all custom endpoints
      matcher: '/api/pd/*',
      middlewares: [helmet()],
    },
    {
      // Apply API Key validation globally (skips when header is absent)
      matcher: '/api/pd/*',
      middlewares: [publicRateLimit, authenticateApiKey],
    },

    // ──────────────────────────────────────────────────────────────
    // Admin-only routes — require a valid JWT with admin/super_admin role
    // ──────────────────────────────────────────────────────────────
    {
      matcher: '/api/pd/admin/*',
      middlewares: [authRateLimit, authenticateAdmin],
    },

    // ──────────────────────────────────────────────────────────────
    // Vendor-authenticated routes — require a valid vendor JWT
    // ──────────────────────────────────────────────────────────────
    {
      // Legacy vendor namespace (if used)
      matcher: '/api/pd/vendor/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/stores/:id',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/products',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/products/*',
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
      matcher: '/api/pd/api-keys',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/api-keys/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/verification',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/notifications',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/ai/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      matcher: '/api/pd/digital/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      // Upload validation for presigned URL endpoint
      matcher: '/api/pd/upload/*',
      middlewares: [authRateLimit, authenticateVendor, validateUpload],
    },
  ],
});
