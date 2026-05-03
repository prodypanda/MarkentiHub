// pandamarket/backend/src/api/routes/pd/ai/seo/route.ts
// =============================================================================
// PandaMarket — AI SEO Generation
// POST /api/pd/ai/seo  { product_id }
// - store_id is ALWAYS derived from JWT; product ownership is enforced.
// - Feature-gated by plan (hasAiSeo) and consumes 1 AI token per call.
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';
import { z } from 'zod';

import { requireStoreContext } from '../../../../middlewares/auth-context';
import {
  PdNotFoundError,
  PdNotOwnerError,
  PdPlanRequiredError,
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/ai/seo/route.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/ai/seo/route.ts
=======
  PdStoreNotFoundError,
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/ai/seo/route.ts
=======
  PdStoreNotFoundError,
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/ai/seo/route.ts
  PdValidationError,
} from '../../../../../utils/errors';
import {
  PLAN_LIMITS,
  PD_EVENTS,
  SubscriptionPlan,
} from '../../../../../utils/constants';
import { createServiceLogger } from '../../../../../utils/logger';

const logger = createServiceLogger('AiSeoRoute');

const bodySchema = z.object({
  product_id: z.string().min(1),
});

interface PdStoreLike {
  id: string;
  subscription_plan: SubscriptionPlan;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreLike[]>;
}

interface IPdCreditService {
  deductTokens(storeId: string, plan: SubscriptionPlan, amount: number): Promise<void>;
}

interface ProductLike {
  id: string;
  metadata?: Record<string, unknown> | null;
}

interface IProductModuleService {
  retrieveProduct(id: string): Promise<ProductLike>;
}

interface IEventBus {
  emit(args: { name: string; data: Record<string, unknown> }): Promise<void>;
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const { storeId } = requireStoreContext(req);

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    parsed.error.issues.forEach((i) => {
      fields[i.path.join('.')] = i.message;
    });
    throw new PdValidationError('Données invalides', { fields });
  }
  const { product_id } = parsed.data;

  const storeService = req.scope.resolve<IPdStoreService>('pdStoreService');
  const creditService = req.scope.resolve<IPdCreditService>('pdCreditService');
  const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as IProductModuleService;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as unknown as IEventBus;

  // Verify product ownership.
  let product: ProductLike;
  try {
    product = await productModuleService.retrieveProduct(product_id);
  } catch {
    throw new PdNotFoundError('Produit');
  }
  if ((product.metadata ?? {})['store_id'] !== storeId) {
    throw new PdNotOwnerError(product_id);
  }

  // Plan gate + token deduction.
  const [store] = await storeService.listPdStores({ filters: { id: storeId } });
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/ai/seo/route.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/ai/seo/route.ts
  const plan = store?.subscription_plan ?? SubscriptionPlan.Free;
=======
  if (!store) throw new PdStoreNotFoundError(storeId);
  const plan = store.subscription_plan;
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/ai/seo/route.ts
=======
  if (!store) throw new PdStoreNotFoundError(storeId);
  const plan = store.subscription_plan;
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/ai/seo/route.ts
  if (!PLAN_LIMITS[plan].hasAiSeo) {
    throw new PdPlanRequiredError('Starter', plan);
  }
  await creditService.deductTokens(storeId, plan, 1);

  await eventBus.emit({
    name: PD_EVENTS.AI_JOB_COMPLETED === 'pd.ai.job.completed' ? 'ai.seo.requested' : 'ai.seo.requested',
    data: { product_id, store_id: storeId },
  });

  logger.info({ store_id: storeId, product_id }, 'AI SEO job queued');
  res.status(202).json({ success: true, message: 'SEO generation job queued.' });
};
