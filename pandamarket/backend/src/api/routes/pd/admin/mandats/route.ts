// @ts-nocheck
// pandamarket/backend/src/api/routes/pd/admin/mandats/route.ts
// =============================================================================
// PandaMarket — Admin Mandat Minute Management
// GET  /api/pd/admin/mandats      → List pending mandats
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

/**
 * GET /api/pd/admin/mandats
 * List pending Mandat Minute proofs awaiting validation
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const pdMandatService = req.scope.resolve('pdMandatService');
  const proofs = await pdMandatService.getPendingQueue(page, limit);

  res.json({ mandats: proofs, page, limit });
}
