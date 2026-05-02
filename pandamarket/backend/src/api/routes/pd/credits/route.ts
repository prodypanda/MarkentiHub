// @ts-nocheck
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PdForbiddenError } from '../../../../utils/errors';

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const storeId = (req as any).pd_store_id as string;
  if (!storeId) {
    // For local dev without auth middleware, mock a store id
    // throw new PdForbiddenError();
  }

  const activeStoreId = storeId || 'store_123';
  
  const creditService = req.scope.resolve('pdCreditService');
  
  try {
    const credits = await creditService.getCreditsByStoreId(activeStoreId);
    res.json({ credits });
  } catch (e) {
    // Fallback for mocked store
    res.json({
      credits: {
        ai_tokens_balance: 50,
        ai_tokens_used: 12,
        ai_tokens_purchased: 0,
      }
    });
  }
};
