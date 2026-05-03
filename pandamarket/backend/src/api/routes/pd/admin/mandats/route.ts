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
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts

import { requireAdminContext } from '../../../../middlewares/auth-context';

interface IPdMandatService {
  getPendingQueue(page: number, limit: number): Promise<unknown[]>;
}

function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }
  return typeof value === 'string' ? value : undefined;
}

function parsePositiveInt(value: unknown, fallback: number, max: number): number {
  const parsed = Number.parseInt(firstQueryValue(value) ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.min(parsed, max);
}
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts

/**
 * GET /api/pd/admin/mandats
 * List pending Mandat Minute proofs awaiting validation
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  requireAdminContext(req);
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts
  const page = parsePositiveInt(req.query.page, 1, 10_000);
  const limit = parsePositiveInt(req.query.limit, 20, 100);
=======
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts
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
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts

  const pdMandatService = req.scope.resolve<IPdMandatService>('pdMandatService');
  const proofs = await pdMandatService.getPendingQueue(page, limit);

  res.json({ mandats: proofs, page, limit });
}
