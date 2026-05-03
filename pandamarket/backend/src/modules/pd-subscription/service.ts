// pandamarket/backend/src/modules/pd-subscription/service.ts
import { MedusaService } from '@medusajs/framework/utils';
import SubscriptionLimits from './models/subscription-limits';
import { PLAN_LIMITS, SubscriptionPlan } from '../../utils/constants';
import {
  PdProductQuotaExceededError,
  PdImageQuotaExceededError,
  PdPlanRequiredError,
  PdSubscriptionDowngradeBlockedError,
} from '../../utils/errors';

type PlanLimits = (typeof PLAN_LIMITS)[SubscriptionPlan.Free];

class PdSubscriptionService extends MedusaService({
  SubscriptionLimits,
}) {
  /**
   * Get the limits for a given plan
   */
  getPlanLimits(plan: SubscriptionPlan): PlanLimits {
    return PLAN_LIMITS[plan];
  }

  /**
   * Check if a vendor can create a new product under their plan
   */
  canCreateProduct(plan: SubscriptionPlan, currentProductCount: number): boolean {
    const limits = PLAN_LIMITS[plan];
    if (limits.maxProducts === -1) return true; // unlimited
    return currentProductCount < limits.maxProducts;
  }

  /**
   * Assert that a vendor can create a product, or throw
   */
  assertCanCreateProduct(plan: SubscriptionPlan, currentProductCount: number): void {
    const limits = PLAN_LIMITS[plan];
    if (limits.maxProducts === -1) return;

    if (currentProductCount >= limits.maxProducts) {
      throw new PdProductQuotaExceededError(
        currentProductCount,
        limits.maxProducts,
        plan,
      );
    }
  }

  /**
   * Check if a vendor can upload another image for a product
   */
  canUploadImage(plan: SubscriptionPlan, currentImageCount: number): boolean {
    const limits = PLAN_LIMITS[plan];
    return currentImageCount < limits.maxImagesPerProduct;
  }

  /**
   * Assert that a vendor can upload an image, or throw
   */
  assertCanUploadImage(plan: SubscriptionPlan, currentImageCount: number): void {
    const limits = PLAN_LIMITS[plan];
    if (currentImageCount >= limits.maxImagesPerProduct) {
      throw new PdImageQuotaExceededError(
        currentImageCount,
        limits.maxImagesPerProduct,
        plan,
      );
    }
  }

  /**
   * Check if a plan has a specific feature
   */
  hasFeature(
    plan: SubscriptionPlan,
    feature: keyof PlanLimits,
  ): boolean {
    const limits = PLAN_LIMITS[plan];
    return Boolean(limits[feature]);
  }

  /**
   * Assert that a plan has a required feature, or throw
   */
  assertHasFeature(plan: SubscriptionPlan, feature: string, requiredPlan: string): void {
    const limits = PLAN_LIMITS[plan] as Record<string, unknown>;
    if (!limits[feature]) {
      throw new PdPlanRequiredError(requiredPlan, plan);
    }
  }

  /**
   * Get the commission rate for a plan
   */
  getCommissionRate(plan: SubscriptionPlan): number {
    return PLAN_LIMITS[plan].commissionRate;
  }

  /**
   * Validate that a downgrade is possible (product count within new limits)
   */
  assertCanDowngrade(
    newPlan: SubscriptionPlan,
    currentProductCount: number,
  ): void {
    const newLimits = PLAN_LIMITS[newPlan];
    if (newLimits.maxProducts !== -1 && currentProductCount > newLimits.maxProducts) {
      throw new PdSubscriptionDowngradeBlockedError(
        currentProductCount,
        newLimits.maxProducts,
      );
    }
  }
}

export default PdSubscriptionService;
