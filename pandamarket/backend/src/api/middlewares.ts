import { defineMiddlewares } from '@medusajs/framework/http';
import { authenticateApiKey } from './middlewares/api-key';

export default defineMiddlewares({
  routes: [
    {
      matcher: '/api/pd/*',
      middlewares: [authenticateApiKey],
    },
  ],
});
