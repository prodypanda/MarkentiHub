// pandamarket/backend/src/api/middlewares/validate.ts
// =============================================================================
// PandaMarket — Zod Validation Middleware
// Validates request body/query/params against a Zod schema.
// =============================================================================

import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';
import { ZodSchema, ZodError } from 'zod';
import { PdValidationError } from '../../utils/errors';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Create a validation middleware for a Zod schema.
 *
 * Usage:
 *   router.post('/stores', validate(createStoreSchema, 'body'), createStoreHandler);
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return async (
    req: MedusaRequest,
    _res: MedusaResponse,
    next: MedusaNextFunction,
  ): Promise<void> => {
    try {
      const data = target === 'body' ? req.body : target === 'query' ? req.query : req.params;
      const parsed = schema.parse(data);

      // Replace raw data with parsed/sanitized data
      if (target === 'body') {
        (req as Record<string, unknown>).validatedBody = parsed;
      } else if (target === 'query') {
        (req as Record<string, unknown>).validatedQuery = parsed;
      } else {
        (req as Record<string, unknown>).validatedParams = parsed;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        error.issues.forEach((issue) => {
          fields[issue.path.join('.')] = issue.message;
        });
        next(new PdValidationError('Données invalides', { fields }));
      } else {
        next(error);
      }
    }
  };
}
