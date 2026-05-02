// @ts-nocheck
// pandamarket/backend/src/api/routes/pd/stores/route.ts
// =============================================================================
// PandaMarket — Store API Routes
// GET  /api/pd/stores/:id  → Get store details
// PUT  /api/pd/stores/:id  → Update store (owner only)
// GET  /api/pd/stores/resolve?hostname=xxx  → Resolve hostname to store_id
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PdStoreNotFoundError, PdNotOwnerError } from '../../../../utils/errors';

/**
 * GET /api/pd/stores/resolve?hostname=xxx
 * Resolve a hostname to a store ID (used by Next.js middleware)
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const hostname = req.query.hostname as string;

  if (!hostname) {
    res.status(400).json({
      error: { code: 'PD_VALIDATION_ERROR', message: 'hostname query parameter is required', details: {} },
    });
    return;
  }

  const pdStoreService = req.scope.resolve('pdStoreService');
  const storeId = await pdStoreService.resolveHostname(hostname);

  if (!storeId) {
    res.status(404).json({
      error: { code: 'PD_STORE_NOT_FOUND', message: 'Boutique introuvable pour ce domaine', details: { hostname } },
    });
    return;
  }

  // Return store details
  const [store] = await pdStoreService.listPdStores({ filters: { id: storeId } });

  res.json({
    store: {
      id: store.id,
      name: store.name,
      subdomain: store.subdomain,
      custom_domain: store.custom_domain,
      theme_id: store.theme_id,
      status: store.status,
      is_verified: store.is_verified,
      settings: store.settings,
      logo_url: store.logo_url,
      category: store.category,
    },
  });
}
