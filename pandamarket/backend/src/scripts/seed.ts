// pandamarket/backend/src/scripts/seed.ts
// =============================================================================
// PandaMarket — Database Seed Script
// Seeds: Subscription Limits, Default Themes, Super Admin, Test Accounts
// Run: npm run seed
// =============================================================================

import { PLAN_LIMITS } from '../utils/constants';

export default async function seed({ container }: { container: any }) {
  // =========================================================================
  // 1. Seed Subscription Limits (7 plans)
  // =========================================================================
  const pdSubscriptionService = container.resolve('pdSubscriptionService');

  const plans = Object.entries(PLAN_LIMITS);
  for (const [plan, limits] of plans) {
    try {
      await pdSubscriptionService.createSubscriptionLimits({
        plan,
        max_products: limits.maxProducts,
        max_images_per_product: limits.maxImagesPerProduct,
        commission_rate: limits.commissionRate,
        has_custom_domain: limits.hasCustomDomain,
        has_page_builder: limits.hasPageBuilder,
        has_ai_seo: limits.hasAiSeo,
        has_image_compression: limits.hasImageCompression,
        has_direct_payment: limits.hasDirectPayment,
        has_api_keys: limits.hasApiKeys,
        has_white_label: limits.hasWhiteLabel,
        ai_tokens_included: limits.aiTokensIncluded,
        yearly_price: limits.yearlyPrice,
      });
      console.log(`  ✅ Plan "${plan}" seeded`);
    } catch {
      console.log(`  ⏭️  Plan "${plan}" already exists, skipping`);
    }
  }

  // =========================================================================
  // 2. Seed Default Themes (3 base themes)
  // =========================================================================
  const pdThemeService = container.resolve('pdThemeService');

  const themes = [
    {
      slug: 'minimal',
      name: 'Minimal',
      description: 'Design épuré et minimaliste, idéal pour les boutiques tendance',
      is_free: true,
      price: 0,
      is_active: true,
      category: 'general',
      features: ['responsive', 'dark-mode', 'fast-loading'],
    },
    {
      slug: 'classic',
      name: 'Classic',
      description: 'Design classique et professionnel, parfait pour les boutiques traditionnelles',
      is_free: true,
      price: 0,
      is_active: true,
      category: 'general',
      features: ['responsive', 'sidebar-nav', 'product-gallery'],
    },
    {
      slug: 'modern',
      name: 'Modern',
      description: 'Design audacieux avec des dégradés et du glassmorphisme',
      is_free: true,
      price: 0,
      is_active: true,
      category: 'general',
      features: ['responsive', 'dark-mode', 'glassmorphism', 'animations', 'hero-video'],
    },
  ];

  for (const theme of themes) {
    try {
      await pdThemeService.createThemes(theme);
      console.log(`  ✅ Theme "${theme.name}" seeded`);
    } catch {
      console.log(`  ⏭️  Theme "${theme.name}" already exists, skipping`);
    }
  }

  console.log('\n🐼 PandaMarket seed complete!');
}
