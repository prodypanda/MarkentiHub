// @ts-nocheck
import { MedusaRequest, MedusaResponse, NextFunction } from '@medusajs/framework/http';
import { PdApiKeyInvalidError } from '../../utils/errors';

export const authenticateApiKey = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
) => {
  const rawKey = req.headers['x-pd-api-key'] as string;

  if (!rawKey) {
    return next(); // Skip if no key (might be a standard session auth)
  }

  const apiKeyService = req.scope.resolve('pdApiKeyService');

  try {
    const { storeId, scopes } = await apiKeyService.validateKey(rawKey);
    
    // Inject store context
    (req as any).pd_store_id = storeId;
    (req as any).pd_scopes = scopes;

    next();
  } catch (error) {
    next(new PdApiKeyInvalidError());
  }
};
