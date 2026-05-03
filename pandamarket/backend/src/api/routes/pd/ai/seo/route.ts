// @ts-nocheck
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';
import { PdBadRequestError, PdForbiddenError } from '../../../../../utils/errors';
import { Modules } from '@medusajs/framework/utils';

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const storeId = (req as any).pd_store_id as string;
  if (!storeId) throw new PdForbiddenError();

  const schema = z.object({
    product_id: z.string(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdBadRequestError('Invalid request body', parsed.error.format());
  }

  const { product_id } = parsed.data;

  const creditService = req.scope.resolve('pdCreditService');
  const storeService = req.scope.resolve('pdStoreModuleService');
  const eventBus = req.scope.resolve(Modules.EVENT_BUS);

  // 1. Verify credits
  const store = await storeService.retrieveStore(storeId);
  
  // Will throw if insufficient
  await creditService.deductTokens(storeId, store.plan || 'free', 1);

  // 2. Queue the background job
  await eventBus.emit({
    name: 'ai.seo.requested',
    data: {
      product_id,
      store_id: storeId,
    },
  });

  res.json({ success: true, message: 'SEO generation job queued.' });
};

