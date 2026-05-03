// pandamarket/backend/src/api/routes/pd/admin/verifications/route.ts
// =============================================================================
// PandaMarket — Admin KYC Management Routes
// GET  /api/pd/admin/verifications          → List pending KYC queue
// PUT  /api/pd/admin/verifications/:id      → Approve/Reject KYC
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

import { requireAdminContext } from '../../../../middlewares/auth-context';

interface IPdVerificationService {
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
 * GET /api/pd/admin/verifications
 * List pending KYC verifications (admin only)
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  requireAdminContext(req);
  const page = parsePositiveInt(req.query.page, 1, 10_000);
  const limit = parsePositiveInt(req.query.limit, 20, 100);

  const pdVerificationService = req.scope.resolve<IPdVerificationService>('pdVerificationService');
  const docs = await pdVerificationService.getPendingQueue(page, limit);

  res.json({ verifications: docs, page, limit });
}
