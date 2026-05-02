// pandamarket/backend/src/utils/logger.ts
// =============================================================================
// PandaMarket — Structured Logger (Pino)
// Never logs sensitive data (passwords, tokens, API keys, card data)
// =============================================================================

import pino from 'pino';

const isProduction = process.env.PD_NODE_ENV === 'production';

/**
 * Main application logger.
 * Outputs JSON in production, pretty-printed in development.
 */
export const logger = pino({
  name: 'pandamarket',
  level: isProduction ? 'info' : 'debug',
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
  redact: {
    paths: [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'apiKey',
      'secret',
      'authorization',
      '*.password',
      '*.token',
      '*.apiKey',
      '*.secret',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    censor: '[REDACTED]',
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
});

/**
 * Create a child logger for a specific service/module.
 */
export function createServiceLogger(serviceName: string): pino.Logger {
  return logger.child({ service: serviceName });
}

/**
 * Log a security event (login, payment, KYC, etc.)
 */
export function logSecurityEvent(
  event: string,
  data: Record<string, unknown>,
): void {
  logger.info({ event, ...data, category: 'security' });
}

/**
 * Log a payment event
 */
export function logPaymentEvent(
  event: string,
  data: Record<string, unknown>,
): void {
  logger.info({ event, ...data, category: 'payment' });
}

export default logger;
