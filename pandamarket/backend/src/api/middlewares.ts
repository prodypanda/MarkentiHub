import { defineMiddlewares } from '@medusajs/framework/http';
import helmet from 'helmet';
import { authenticateApiKey } from './middlewares/api-key';
import { authenticateVendor } from './middlewares/authenticate-vendor';
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
      // Protect vendor API routes
      matcher: '/api/pd/vendor/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      // Protect auth-required store actions like updating settings
      matcher: '/api/pd/stores/:id/*',
      middlewares: [authRateLimit, authenticateVendor],
    },
    {
      // Apply API Key validation globally, but it skips if no header is present
      matcher: '/api/pd/*',
      middlewares: [publicRateLimit, authenticateApiKey],
    },
    {
      // Apply upload validation for presigned URLs endpoints
      matcher: '/api/pd/upload/*',
      middlewares: [authRateLimit, authenticateVendor, validateUpload],
    }
  ],
});
