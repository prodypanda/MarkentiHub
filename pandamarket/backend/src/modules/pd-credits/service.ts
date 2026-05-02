// @ts-nocheck
// pandamarket/backend/src/modules/pd-credits/service.ts
import { MedusaService } from '@medusajs/framework/utils';
import VendorCredits from './models/vendor-credits';
import { PdInsufficientTokensError, PdNotFoundError } from '../../utils/errors';
import { PLAN_LIMITS, SubscriptionPlan } from '../../utils/constants';
import { createServiceLogger } from '../../utils/logger';

const logger = createServiceLogger('CreditService');

class PdCreditService extends MedusaService({
  VendorCredits,
}) {
  /**
   * Initialize credits for a new store
   */
  async initializeCredits(storeId: string, plan: SubscriptionPlan) {
    const limits = PLAN_LIMITS[plan];
    const initialTokens = limits.aiTokensIncluded === -1 ? 0 : limits.aiTokensIncluded;

    return this.createVendorCredits({
      store_id: storeId,
      ai_tokens_balance: initialTokens,
      ai_tokens_used: 0,
      ai_tokens_purchased: 0,
      last_refill_at: new Date().toISOString(),
    });
  }

  /**
   * Check if the vendor has enough tokens for an operation.
   * Plans with unlimited tokens (-1) always pass.
   */
  hasTokens(plan: SubscriptionPlan, balance: number, required: number): boolean {
    const limits = PLAN_LIMITS[plan];
    if (limits.aiTokensIncluded === -1) return true; // unlimited
    return balance >= required;
  }

  /**
   * Deduct tokens from a vendor's balance.
   * Throws if insufficient tokens (unless unlimited plan).
   */
  async deductTokens(
    storeId: string,
    plan: SubscriptionPlan,
    amount: number,
  ): Promise<void> {
    const limits = PLAN_LIMITS[plan];

    // Unlimited plans don't deduct tokens
    if (limits.aiTokensIncluded === -1) {
      logger.debug({ store_id: storeId, amount }, 'Unlimited plan - no token deduction');
      return;
    }

    const credits = await this.getCreditsByStoreId(storeId);

    if (credits.ai_tokens_balance < amount) {
      throw new PdInsufficientTokensError(amount, credits.ai_tokens_balance);
    }

    await this.updateVendorCredits({
      id: credits.id,
      ai_tokens_balance: credits.ai_tokens_balance - amount,
      ai_tokens_used: credits.ai_tokens_used + amount,
    });

    logger.info({ store_id: storeId, deducted: amount, remaining: credits.ai_tokens_balance - amount }, 'Tokens deducted');
  }

  /**
   * Add purchased tokens to a vendor's balance
   */
  async addTokens(storeId: string, amount: number): Promise<void> {
    const credits = await this.getCreditsByStoreId(storeId);

    await this.updateVendorCredits({
      id: credits.id,
      ai_tokens_balance: credits.ai_tokens_balance + amount,
      ai_tokens_purchased: credits.ai_tokens_purchased + amount,
    });

    logger.info({ store_id: storeId, added: amount, new_balance: credits.ai_tokens_balance + amount }, 'Tokens added');
  }

  /**
   * Get credits by store ID
   */
  async getCreditsByStoreId(storeId: string) {
    const [credits] = await this.listVendorCredits({
      filters: { store_id: storeId },
    });

    if (!credits) {
      throw new PdNotFoundError('Credits');
    }

    return credits;
  }
}

export default PdCreditService;
