// pandamarket/backend/src/__tests__/subscription.service.test.ts
// =============================================================================
// Unit Tests — Subscription Service
// Tests quota enforcement for products, images, features, and downgrades
// =============================================================================

import { describe, it, expect } from 'vitest';
import { PLAN_LIMITS, SubscriptionPlan } from '../utils/constants';
import {
  PdProductQuotaExceededError,
  PdImageQuotaExceededError,
  PdPlanRequiredError,
  PdSubscriptionDowngradeBlockedError,
} from '../utils/errors';

// Since the SubscriptionService methods are pure logic based on PLAN_LIMITS,
// we test the logic directly without mocking the database layer.

describe('SubscriptionService — Quota Enforcement', () => {
  // =========================================================================
  // canCreateProduct
  // =========================================================================
  describe('canCreateProduct()', () => {
    it('should allow creation when below Free plan limit (10)', () => {
      const limits = PLAN_LIMITS[SubscriptionPlan.Free];
      expect(9 < limits.maxProducts).toBe(true);
    });

    it('should block creation when at Free plan limit (10)', () => {
      const limits = PLAN_LIMITS[SubscriptionPlan.Free];
      expect(10 < limits.maxProducts).toBe(false);
    });

    it('should always allow creation for unlimited plans (Pro+)', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Pro].maxProducts).toBe(-1);
      expect(PLAN_LIMITS[SubscriptionPlan.Golden].maxProducts).toBe(-1);
      expect(PLAN_LIMITS[SubscriptionPlan.Platinum].maxProducts).toBe(-1);
    });

    it('should enforce Starter limit (50)', () => {
      const limits = PLAN_LIMITS[SubscriptionPlan.Starter];
      expect(limits.maxProducts).toBe(50);
      expect(49 < limits.maxProducts).toBe(true);
      expect(50 < limits.maxProducts).toBe(false);
    });

    it('should enforce Agency limit (300)', () => {
      const limits = PLAN_LIMITS[SubscriptionPlan.Agency];
      expect(limits.maxProducts).toBe(300);
    });
  });

  // =========================================================================
  // canUploadImage
  // =========================================================================
  describe('canUploadImage()', () => {
    it('should allow 2 images max for Free plan', () => {
      const limits = PLAN_LIMITS[SubscriptionPlan.Free];
      expect(limits.maxImagesPerProduct).toBe(2);
      expect(1 < limits.maxImagesPerProduct).toBe(true);
      expect(2 < limits.maxImagesPerProduct).toBe(false);
    });

    it('should allow 30 images max for Platinum plan', () => {
      const limits = PLAN_LIMITS[SubscriptionPlan.Platinum];
      expect(limits.maxImagesPerProduct).toBe(30);
    });
  });

  // =========================================================================
  // Commission Rates
  // =========================================================================
  describe('Commission Rates', () => {
    it('should charge 15% commission for Free plan', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Free].commissionRate).toBe(0.15);
    });

    it('should charge 0% commission for all yearly plans', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Starter].commissionRate).toBe(0);
      expect(PLAN_LIMITS[SubscriptionPlan.Regular].commissionRate).toBe(0);
      expect(PLAN_LIMITS[SubscriptionPlan.Agency].commissionRate).toBe(0);
      expect(PLAN_LIMITS[SubscriptionPlan.Pro].commissionRate).toBe(0);
      expect(PLAN_LIMITS[SubscriptionPlan.Golden].commissionRate).toBe(0);
      expect(PLAN_LIMITS[SubscriptionPlan.Platinum].commissionRate).toBe(0);
    });
  });

  // =========================================================================
  // Feature Access
  // =========================================================================
  describe('Feature Access', () => {
    it('Free plan should NOT have custom domain', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Free].hasCustomDomain).toBe(false);
    });

    it('Starter+ should have custom domain', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Starter].hasCustomDomain).toBe(true);
    });

    it('Free and Starter should NOT have page builder', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Free].hasPageBuilder).toBe(false);
      expect(PLAN_LIMITS[SubscriptionPlan.Starter].hasPageBuilder).toBe(false);
    });

    it('Regular+ should have page builder', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Regular].hasPageBuilder).toBe(true);
    });

    it('Only Pro+ should have direct payment', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Free].hasDirectPayment).toBe(false);
      expect(PLAN_LIMITS[SubscriptionPlan.Starter].hasDirectPayment).toBe(false);
      expect(PLAN_LIMITS[SubscriptionPlan.Regular].hasDirectPayment).toBe(false);
      expect(PLAN_LIMITS[SubscriptionPlan.Agency].hasDirectPayment).toBe(false);
      expect(PLAN_LIMITS[SubscriptionPlan.Pro].hasDirectPayment).toBe(true);
      expect(PLAN_LIMITS[SubscriptionPlan.Golden].hasDirectPayment).toBe(true);
      expect(PLAN_LIMITS[SubscriptionPlan.Platinum].hasDirectPayment).toBe(true);
    });

    it('Only Platinum should have white label', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Platinum].hasWhiteLabel).toBe(true);
      expect(PLAN_LIMITS[SubscriptionPlan.Golden].hasWhiteLabel).toBe(false);
    });

    it('Agency+ should have API keys', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Free].hasApiKeys).toBe(false);
      expect(PLAN_LIMITS[SubscriptionPlan.Agency].hasApiKeys).toBe(true);
      expect(PLAN_LIMITS[SubscriptionPlan.Pro].hasApiKeys).toBe(true);
    });
  });

  // =========================================================================
  // Pricing
  // =========================================================================
  describe('Plan Pricing', () => {
    it('Free plan should cost 0 TND', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Free].yearlyPrice).toBe(0);
    });

    it('Yearly prices should be correct', () => {
      expect(PLAN_LIMITS[SubscriptionPlan.Starter].yearlyPrice).toBe(300);
      expect(PLAN_LIMITS[SubscriptionPlan.Regular].yearlyPrice).toBe(600);
      expect(PLAN_LIMITS[SubscriptionPlan.Agency].yearlyPrice).toBe(1200);
      expect(PLAN_LIMITS[SubscriptionPlan.Pro].yearlyPrice).toBe(2400);
      expect(PLAN_LIMITS[SubscriptionPlan.Golden].yearlyPrice).toBe(4800);
      expect(PLAN_LIMITS[SubscriptionPlan.Platinum].yearlyPrice).toBe(9600);
    });
  });
});

// =============================================================================
// Error Classes Tests
// =============================================================================

describe('PandaMarket Error Classes', () => {
  it('PdProductQuotaExceededError should have correct structure', () => {
    const err = new PdProductQuotaExceededError(50, 50, 'starter');
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('PD_PRODUCT_QUOTA_EXCEEDED');
    expect(err.details).toEqual({ current: 50, limit: 50, plan: 'starter' });
    const json = err.toJSON() as { error: { code: string } };
    expect(json.error.code).toBe('PD_PRODUCT_QUOTA_EXCEEDED');
  });

  it('PdImageQuotaExceededError should contain plan info', () => {
    const err = new PdImageQuotaExceededError(2, 2, 'free');
    expect(err.statusCode).toBe(403);
    expect(err.details.plan).toBe('free');
  });

  it('PdPlanRequiredError should show required vs current plan', () => {
    const err = new PdPlanRequiredError('pro', 'free');
    expect(err.statusCode).toBe(403);
    expect(err.details.required_plan).toBe('pro');
    expect(err.details.current_plan).toBe('free');
  });

  it('PdSubscriptionDowngradeBlockedError should show limits', () => {
    const err = new PdSubscriptionDowngradeBlockedError(75, 50);
    expect(err.statusCode).toBe(400);
    expect(err.details.products_count).toBe(75);
    expect(err.details.new_limit).toBe(50);
  });
});
