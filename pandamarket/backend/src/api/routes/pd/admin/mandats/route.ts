// pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts
// =============================================================================
// PandaMarket — Admin Mandat Minute Management
// GET  /api/pd/admin/mandats      → List pending mandats
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';

import { requireAdminContext } from '../../../../middlewares/auth-context';
import { PdValidationError } from '../../../../../utils/errors';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

interface IPdMandatService {
  getPendingQueue(page: number, limit: number): Promise<unknown[]>;
}

function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }
  return typeof value === 'string' ? value : undefined;
}

function validationFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  error.issues.forEach((issue) => {
    fields[issue.path.join('.')] = issue.message;
  });
  return fields;
}

/**
 * GET /api/pd/admin/mandats
 * List pending Mandat Minute proofs awaiting validation
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  requireAdminContext(req);
  const parsed = querySchema.safeParse({
    page: firstQueryValue(req.query.page) ?? undefined,
    limit: firstQueryValue(req.query.limit) ?? undefined,
  });
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }
  const { page, limit } = parsed.data;

  const pdMandatService = req.scope.resolve<IPdMandatService>('pdMandatService');
  const proofs = await pdMandatService.getPendingQueue(page, limit);

  res.json({ mandats: proofs, page, limit });
}
