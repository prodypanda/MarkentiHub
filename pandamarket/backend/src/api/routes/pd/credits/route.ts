// @ts-nocheck
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PdForbiddenError } from '../../../../utils/errors';

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const storeId = (req as any).pd_store_id as string;
  if (!storeId) throw new PdForbiddenError();
  
  const creditService = req.scope.resolve('pdCreditService');
  const credits = await creditService.getCreditsByStoreId(storeId);
  res.json({ credits });
};
