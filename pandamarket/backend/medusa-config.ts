// pandamarket/backend/medusa-config.ts
import { defineConfig, loadEnv } from '@medusajs/framework/utils';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.PD_DATABASE_URL,
    databaseLogging: process.env.PD_NODE_ENV === 'development',
    redisUrl: process.env.PD_REDIS_URL,
    http: {
      storeCors: process.env.PD_STORE_CORS || 'http://localhost:3000',
      adminCors: process.env.PD_ADMIN_CORS || 'http://localhost:3000',
      authCors: process.env.PD_STORE_CORS || 'http://localhost:3000',
      jwtSecret: process.env.PD_JWT_SECRET || 'pd-dev-jwt-secret',
      cookieSecret: process.env.PD_COOKIE_SECRET || 'pd-dev-cookie-secret',
    },
    workerMode: process.env.MEDUSA_WORKER_MODE as 'shared' | 'worker' | 'server' || 'shared',
  },
  admin: {
    disable: false,
    path: '/app',
  },
  modules: [
    // PandaMarket custom modules will be registered here
    {
      resolve: './src/modules/pd-store',
    },
    {
      resolve: './src/modules/pd-subscription',
    },
    {
      resolve: './src/modules/pd-wallet',
    },
    {
      resolve: './src/modules/pd-credits',
    },
    {
      resolve: './src/modules/pd-verification',
    },
    {
      resolve: './src/modules/pd-reports',
    },
    {
      resolve: './src/modules/pd-mandat',
    },
    {
      resolve: './src/modules/pd-api-keys',
    },
    {
      resolve: './src/modules/pd-themes',
    },
    {
      resolve: './src/modules/pd-notifications',
    },
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            resolve: './src/modules/payment-providers/cod',
            id: 'pd-cod',
          },
          {
            resolve: './src/modules/payment-providers/mandat',
            id: 'pd-mandat',
          },
          {
            resolve: './src/modules/payment-providers/flouci',
            id: 'pd-flouci',
          },
          {
            resolve: './src/modules/payment-providers/konnect',
            id: 'pd-konnect',
          },
        ],
      },
    },
  ],
});
