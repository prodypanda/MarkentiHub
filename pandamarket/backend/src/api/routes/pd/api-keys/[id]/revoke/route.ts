// @ts-nocheck
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const storeId = (req as any).pd_store_id as string || 'store_123';
  const keyId = req.params.id;

  const apiKeyService = req.scope.resolve('pdApiKeyService');

  // Service will handle active state update
  await apiKeyService.revokeKey(keyId, storeId);

  res.json({ success: true, message: 'API Key revoked' });
};
