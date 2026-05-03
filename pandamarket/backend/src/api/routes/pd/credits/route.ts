// pandamarket/backend/src/api/routes/pd/credits/route.ts
// =============================================================================
// PandaMarket — AI Credits Balance
// GET /api/pd/credits   → returns the vendor's AI token balance / usage.
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

import { requireStoreContext } from '../../../middlewares/auth-context';
import { PLAN_LIMITS, SubscriptionPlan } from '../../../../utils/constants';
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/credits/route.ts
=======
import { PdStoreNotFoundError } from '../../../../utils/errors';
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/credits/route.ts

interface CreditsRecord {
  ai_tokens_balance: number;
  ai_tokens_used: number;
  ai_tokens_purchased: number;
}

interface IPdCreditService {
  getCreditsByStoreId(storeId: string): Promise<CreditsRecord>;
}

interface PdStoreLike {
  id: string;
  subscription_plan: SubscriptionPlan;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreLike[]>;
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const { storeId } = requireStoreContext(req);

  const creditService = req.scope.resolve<IPdCreditService>('pdCreditService');
  const storeService = req.scope.resolve<IPdStoreService>('pdStoreService');

  const [store] = await storeService.listPdStores({ filters: { id: storeId } });
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/credits/route.ts
  const plan = store?.subscription_plan ?? SubscriptionPlan.Free;
=======
  if (!store) throw new PdStoreNotFoundError(storeId);
  const plan = store.subscription_plan;
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/credits/route.ts
  const isUnlimited = PLAN_LIMITS[plan].aiTokensIncluded === -1;

  const credits = await creditService.getCreditsByStoreId(storeId);

  res.json({
    credits: {
      ai_tokens_balance: isUnlimited ? 'unlimited' : credits.ai_tokens_balance,
      ai_tokens_used: credits.ai_tokens_used,
      ai_tokens_purchased: credits.ai_tokens_purchased,
      plan,
      is_unlimited: isUnlimited,
    },
  });
};
