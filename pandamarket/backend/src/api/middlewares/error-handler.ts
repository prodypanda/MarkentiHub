// pandamarket/backend/src/api/middlewares/error-handler.ts
// =============================================================================
// PandaMarket — Global Error Handler Middleware
// Catches all errors and returns structured PD_* error responses.
// Never exposes stack traces or internal details to the client.
// =============================================================================

import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';
import { PdError } from '../../utils/errors';
import { createServiceLogger } from '../../utils/logger';

const logger = createServiceLogger('ErrorHandler');

export async function errorHandler(
  error: Error,
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
): Promise<void> {
  // Handle PandaMarket custom errors
  if (error instanceof PdError) {
    if (error.statusCode >= 500) {
      logger.error(
        { err: error, path: req.path, method: req.method },
        'Server error',
      );
    } else {
      logger.warn(
        { code: error.code, path: req.path, method: req.method },
        error.message,
      );
    }

    res.status(error.statusCode).json(error.toJSON());
    return;
  }

  // Handle Zod validation errors
  if (error.name === 'ZodError') {
    const zodError = error as unknown as { issues: Array<{ path: string[]; message: string }> };
    const fields: Record<string, string> = {};
    zodError.issues.forEach((issue) => {
      fields[issue.path.join('.')] = issue.message;
    });

    res.status(400).json({
      error: {
        code: 'PD_VALIDATION_ERROR',
        message: 'Données invalides',
        details: { fields },
      },
    });
    return;
  }

  // Handle unknown errors — log full stack but return generic message
  logger.error(
    { err: error, path: req.path, method: req.method },
    'Unhandled error',
  );

  res.status(500).json({
    error: {
      code: 'PD_INTERNAL_ERROR',
      message: 'Erreur interne du serveur',
      details: {},
    },
  });
}
