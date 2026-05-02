// pandamarket/backend/src/utils/validators.ts
// =============================================================================
// PandaMarket — Zod Validation Schemas
// All external inputs are validated using these schemas.
// =============================================================================

import { z } from 'zod';
import {
  SubscriptionPlan,
  ShippingMode,
  PaymentGateway,
  PayoutMode,
  MandatUploader,
} from './constants';

// =============================================================================
// Common Schemas
// =============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamSchema = z.object({
  id: z.string().uuid('ID invalide'),
});

// =============================================================================
// Auth Schemas
// =============================================================================

export const registerVendorSchema = z.object({
  email: z.string().email("Format d'email invalide").max(255),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128),
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  store_name: z.string().min(2, 'Le nom de boutique doit contenir au moins 2 caractères').max(100),
  subdomain: z
    .string()
    .min(3, 'Le sous-domaine doit contenir au moins 3 caractères')
    .max(50)
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      'Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets',
    ),
  category: z.string().max(100).optional(),
  plan: z.nativeEnum(SubscriptionPlan).default(SubscriptionPlan.Free),
});

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format d'email invalide"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128),
});

// =============================================================================
// Store Schemas
// =============================================================================

export const updateStoreSchema = z.object({
  store_name: z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  shipping_mode: z.nativeEnum(ShippingMode).optional(),
});

export const updateStoreSettingsSchema = z.object({
  colors: z
    .object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    })
    .optional(),
  logo_url: z.string().url().optional(),
  favicon_url: z.string().url().optional(),
  store_name_display: z.string().max(100).optional(),
  announcement: z.string().max(500).optional(),
});

export const updateStoreThemeSchema = z.object({
  theme_id: z.string().min(1).max(50),
});

export const updatePaymentConfigSchema = z.object({
  flouci_app_token: z.string().min(1).optional(),
  flouci_app_secret: z.string().min(1).optional(),
  konnect_api_key: z.string().min(1).optional(),
  konnect_receiver_wallet: z.string().min(1).optional(),
});

export const updateCustomDomainSchema = z.object({
  custom_domain: z
    .string()
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/,
      'Format de domaine invalide',
    )
    .max(255),
});

// =============================================================================
// Product Schemas
// =============================================================================

export const createProductSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères').max(200),
  description: z.string().max(5000).optional(),
  handle: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  type: z.enum(['physical', 'digital', 'service']).default('physical'),
  price: z.number().min(0, 'Le prix ne peut pas être négatif'),
  compare_at_price: z.number().min(0).optional(),
  cost_per_item: z.number().min(0).optional(),
  sku: z.string().max(100).optional(),
  barcode: z.string().max(100).optional(),
  quantity: z.number().int().min(0).default(0),
  weight: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// =============================================================================
// KYC / Verification Schemas
// =============================================================================

export const submitVerificationSchema = z.object({
  rc_document_key: z.string().min(1, 'Le document RC est requis'),
  cin_document_key: z.string().min(1, 'Le document CIN est requis'),
  phone_number: z
    .string()
    .regex(/^\+216\d{8}$/, 'Numéro de téléphone invalide (format: +216XXXXXXXX)'),
});

export const reviewVerificationSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  notes: z.string().max(1000).optional(),
});

// =============================================================================
// Wallet Schemas
// =============================================================================

export const withdrawalSchema = z.object({
  amount: z.number().positive('Le montant doit être positif'),
});

export const updatePayoutModeSchema = z.object({
  payout_mode: z.nativeEnum(PayoutMode),
});

// =============================================================================
// Payment Schemas
// =============================================================================

export const initPaymentSchema = z.object({
  order_id: z.string().uuid(),
  gateway: z.nativeEnum(PaymentGateway),
  success_url: z.string().url(),
  fail_url: z.string().url(),
});

export const mandatUploadSchema = z.object({
  order_id: z.string().uuid(),
  image_key: z.string().min(1),
  uploaded_by: z.nativeEnum(MandatUploader),
});

export const reviewMandatSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejection_reason: z.string().max(500).optional(),
});

// =============================================================================
// Report Schemas
// =============================================================================

export const createReportSchema = z.object({
  store_id: z.string().uuid('ID boutique invalide'),
  order_id: z.string().uuid().optional(),
  reason: z.string().min(10, 'Le motif doit contenir au moins 10 caractères').max(2000),
});

// =============================================================================
// API Key Schemas
// =============================================================================

export const createApiKeySchema = z.object({
  label: z.string().min(1).max(100),
  scopes: z
    .array(
      z.enum([
        'products:read',
        'products:write',
        'orders:read',
        'orders:write',
        'stock:read',
        'stock:write',
      ]),
    )
    .min(1, 'Au moins un scope est requis'),
  expires_at: z.string().datetime().optional(),
});

// =============================================================================
// AI / Credits Schemas
// =============================================================================

export const purchaseCreditsSchema = z.object({
  pack: z.enum(['100', '500']),
  gateway: z.nativeEnum(PaymentGateway),
});

export const compressImageSchema = z.object({
  product_id: z.string().uuid(),
  image_key: z.string().min(1),
});

export const generateSeoSchema = z.object({
  product_id: z.string().uuid(),
  image_key: z.string().min(1).optional(),
});

// =============================================================================
// Search Schemas
// =============================================================================

export const searchSchema = z.object({
  q: z.string().max(200).default(''),
  category: z.string().max(100).optional(),
  store_id: z.string().uuid().optional(),
  price_min: z.coerce.number().min(0).optional(),
  price_max: z.coerce.number().min(0).optional(),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest']).default('relevance'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// =============================================================================
// Subscription Schemas
// =============================================================================

export const upgradePlanSchema = z.object({
  plan: z.nativeEnum(SubscriptionPlan),
  gateway: z.nativeEnum(PaymentGateway).optional(),
});

// =============================================================================
// Type Exports (inferred from schemas)
// =============================================================================

export type RegisterVendorInput = z.infer<typeof registerVendorSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
export type UpdateStoreSettingsInput = z.infer<typeof updateStoreSettingsSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type SubmitVerificationInput = z.infer<typeof submitVerificationSchema>;
export type WithdrawalInput = z.infer<typeof withdrawalSchema>;
export type InitPaymentInput = z.infer<typeof initPaymentSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type SearchInput = z.infer<typeof searchSchema>;
