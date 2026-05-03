// pandamarket/backend/src/api/routes/pd/api-keys/[id]/revoke/route.ts
// =============================================================================
// PandaMarket — Revoke a vendor API key (soft-delete).
// POST /api/pd/api-keys/:id/revoke   → requires JWT vendor auth + ownership.
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

import { requireStoreContext } from '../../../../../middlewares/auth-context';
import { PdNotFoundError, PdNotOwnerError } from '../../../../../../utils/errors';

interface ApiKeyRecord {
  id: string;
  store_id: string;
}

interface IPdApiKeyService {
  listApiKeys(args: { filters: { id: string } }): Promise<ApiKeyRecord[]>;
  revokeKey(keyId: string, storeId: string): Promise<void>;
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const { storeId } = requireStoreContext(req);
  const keyId = req.params.id;

  const apiKeyService = req.scope.resolve<IPdApiKeyService>('pdApiKeyService');
  const [key] = await apiKeyService.listApiKeys({ filters: { id: keyId } });
  if (!key) throw new PdNotFoundError('Clé API');
  if (key.store_id !== storeId) throw new PdNotOwnerError(keyId);

  await apiKeyService.revokeKey(keyId, storeId);
  res.json({ success: true, message: 'Clé API révoquée' });
};
