// pandamarket/backend/src/api/routes/pd/subscriptions/route.ts
// =============================================================================
// PandaMarket — Subscription Routes
// GET /api/pd/subscriptions/plans → List all plans with limits
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PLAN_LIMITS } from '../../../../utils/constants';

/**
 * GET /api/pd/subscriptions/plans
 * List all available subscription plans with their limits.
 * Public endpoint — no auth required.
 */
export async function GET(
  _req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const plans = Object.entries(PLAN_LIMITS).map(([plan, limits]) => ({
    plan,
    ...limits,
    maxProducts: limits.maxProducts === -1 ? 'unlimited' : limits.maxProducts,
    aiTokensIncluded: limits.aiTokensIncluded === -1 ? 'unlimited' : limits.aiTokensIncluded,
  }));

  res.json({ plans });
}
