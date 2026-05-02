// @ts-nocheck
// pandamarket/backend/src/api/routes/pd/stores/[id]/route.ts
// =============================================================================
// PandaMarket — Store Detail Routes
// GET  /api/pd/stores/:id  → Get store details
// PUT  /api/pd/stores/:id  → Update store (owner only)
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PdStoreNotFoundError, PdNotOwnerError } from '../../../../../utils/errors';

/**
 * GET /api/pd/stores/:id
 * Get store details (public — no auth required)
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const { id } = req.params;
  const pdStoreService = req.scope.resolve('pdStoreService');

  const [store] = await pdStoreService.listPdStores({ filters: { id } });

  if (!store) {
    throw new PdStoreNotFoundError(id);
  }

  res.json({
    store: {
      id: store.id,
      name: store.name,
      description: store.description,
      subdomain: store.subdomain,
      custom_domain: store.custom_domain,
      theme_id: store.theme_id,
      status: store.status,
      is_verified: store.is_verified,
      subscription_plan: store.subscription_plan,
      settings: store.settings,
      logo_url: store.logo_url,
      favicon_url: store.favicon_url,
      category: store.category,
      shipping_mode: store.shipping_mode,
      created_at: store.created_at,
    },
  });
}

/**
 * PUT /api/pd/stores/:id
 * Update store details (owner only — must be authenticated)
 */
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const { id } = req.params;
  const pdStoreService = req.scope.resolve('pdStoreService');

  const [store] = await pdStoreService.listPdStores({ filters: { id } });

  if (!store) {
    throw new PdStoreNotFoundError(id);
  }

  // Tenant isolation: ensure the authenticated user owns this store
  const authStoreId = (req as Record<string, unknown>).pd_store_id as string;
  if (authStoreId && store.id !== authStoreId) {
    throw new PdNotOwnerError(id);
  }

  const body = (req as Record<string, unknown>).validatedBody as Record<string, unknown>;

  const updated = await pdStoreService.updatePdStores({
    id,
    ...body,
  });

  res.json({ store: updated });
}
