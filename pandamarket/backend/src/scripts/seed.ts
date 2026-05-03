// pandamarket/backend/src/scripts/seed.ts
// =============================================================================
// PandaMarket — Database Seed Script
// Seeds: Subscription Limits, Default Themes, Super Admin, Test Accounts
// Run: npm run seed
// =============================================================================

import { PLAN_LIMITS } from '../utils/constants';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('SeedScript');

type PlanSeedInput = {
  plan: string;
  max_products: number;
  max_images_per_product: number;
  commission_rate: number;
  has_custom_domain: boolean;
  has_page_builder: boolean;
  has_ai_seo: boolean;
  has_image_compression: boolean;
  has_direct_payment: boolean;
  has_api_keys: boolean;
  has_white_label: boolean;
  ai_tokens_included: number;
  yearly_price: number;
};

type ThemeSeedInput = {
  slug: string;
  name: string;
  description: string;
  is_free: boolean;
  price: number;
  is_active: boolean;
  category: string;
  features: string[];
};

interface PdSubscriptionSeedService {
  createSubscriptionLimits(input: PlanSeedInput): Promise<unknown>;
}

interface PdThemeSeedService {
  createThemes(input: ThemeSeedInput): Promise<unknown>;
}

interface SeedContainer {
  resolve(name: 'pdSubscriptionService'): PdSubscriptionSeedService;
  resolve(name: 'pdThemeService'): PdThemeSeedService;
}

export default async function seed({ container }: { container: SeedContainer }) {
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
      logger.info({ plan }, 'Subscription plan seeded');
    } catch {
      logger.info({ plan }, 'Subscription plan already exists, skipping');
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
      logger.info({ theme: theme.name }, 'Theme seeded');
    } catch {
      logger.info({ theme: theme.name }, 'Theme already exists, skipping');
    }
  }

  logger.info('PandaMarket seed complete');
}
