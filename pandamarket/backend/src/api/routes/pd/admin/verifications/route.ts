// pandamarket/backend/src/api/routes/pd/admin/verifications/route.ts
// =============================================================================
// PandaMarket — Admin KYC Management Routes
// GET  /api/pd/admin/verifications          → List pending KYC queue
// PUT  /api/pd/admin/verifications/:id      → Approve/Reject KYC
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';

import { requireAdminContext } from '../../../../middlewares/auth-context';
import { PdValidationError } from '../../../../../utils/errors';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

interface IPdVerificationService {
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
 * GET /api/pd/admin/verifications
 * List pending KYC verifications (admin only)
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

  const pdVerificationService = req.scope.resolve<IPdVerificationService>('pdVerificationService');
  const docs = await pdVerificationService.getPendingQueue(page, limit);

  res.json({ verifications: docs, page, limit });
}
