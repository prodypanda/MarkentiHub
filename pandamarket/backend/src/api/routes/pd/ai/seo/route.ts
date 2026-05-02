// @ts-nocheck
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';
import { PdBadRequestError } from '../../../../../utils/errors';
import { Modules } from '@medusajs/framework/utils';

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const schema = z.object({
    store_id: z.string(),
    product_id: z.string(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdBadRequestError('Invalid request body', parsed.error.format());
  }

  const { store_id, product_id } = parsed.data;

  const creditService = req.scope.resolve('pdCreditService');
  const storeService = req.scope.resolve('pdStoreModuleService');
  const eventBus = req.scope.resolve(Modules.EVENT_BUS);

  // 1. Verify credits
  const store = await storeService.retrieveStore(store_id);
  
  // Will throw if insufficient
  await creditService.deductTokens(store_id, store.plan || 'free', 1);

  // 2. Queue the background job
  await eventBus.emit({
    name: 'ai.seo.requested',
    data: {
      product_id,
      store_id,
    },
  });

  res.json({ success: true, message: 'SEO generation job queued.' });
};
