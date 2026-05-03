// pandamarket/backend/src/api/middlewares/api-key.ts
// =============================================================================
// PandaMarket — API Key Authentication Middleware
// Used on /api/pd/vendor/* external ERP/POS endpoints.
// Validates the pd_sk_* key against its stored hash and injects store context.
// =============================================================================

import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';

import { PdApiKeyInvalidError } from '../../utils/errors';

interface IPdApiKeyService {
  validateKey(rawKey: string): Promise<{ storeId: string; scopes: string[] }>;
}

export const authenticateApiKey = async (
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction,
): Promise<void> => {
  const rawKey = req.headers['x-pd-api-key'];
  if (typeof rawKey !== 'string' || rawKey.length === 0) {
    return next(new PdApiKeyInvalidError());
  }

  const apiKeyService = req.scope.resolve<IPdApiKeyService>('pdApiKeyService');

  try {
    const { storeId, scopes } = await apiKeyService.validateKey(rawKey);
    (req as unknown as Record<string, unknown>).pd_store_id = storeId;
    (req as unknown as Record<string, unknown>).pd_scopes = scopes;
    return next();
  } catch {
    return next(new PdApiKeyInvalidError());
  }
};
