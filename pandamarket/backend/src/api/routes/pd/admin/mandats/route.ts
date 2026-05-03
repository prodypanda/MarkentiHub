// pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts
// =============================================================================
// PandaMarket — Admin Mandat Minute Management
// GET  /api/pd/admin/mandats      → List pending mandats
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

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

/**
 * GET /api/pd/admin/mandats
 * List pending Mandat Minute proofs awaiting validation
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  requireAdminContext(req);
  const page = parsePositiveInt(req.query.page, 1, 10_000);
  const limit = parsePositiveInt(req.query.limit, 20, 100);

  const pdMandatService = req.scope.resolve<IPdMandatService>('pdMandatService');
  const proofs = await pdMandatService.getPendingQueue(page, limit);

  res.json({ mandats: proofs, page, limit });
}
