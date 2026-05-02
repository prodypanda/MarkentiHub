// @ts-nocheck
// pandamarket/backend/src/api/routes/pd/admin/verifications/route.ts
// =============================================================================
// PandaMarket — Admin KYC Management Routes
// GET  /api/pd/admin/verifications          → List pending KYC queue
// PUT  /api/pd/admin/verifications/:id      → Approve/Reject KYC
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

/**
 * GET /api/pd/admin/verifications
 * List pending KYC verifications (admin only)
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const pdVerificationService = req.scope.resolve('pdVerificationService');
  const docs = await pdVerificationService.getPendingQueue(page, limit);

  res.json({ verifications: docs, page, limit });
}
