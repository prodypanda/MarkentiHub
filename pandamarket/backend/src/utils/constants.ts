// pandamarket/backend/src/utils/constants.ts
// =============================================================================
// PandaMarket — Global Constants & Enums
// =============================================================================

/**
 * Store verification status
 */
export enum StoreStatus {
  Unverified = 'unverified',
  Verified = 'verified',
  Suspended = 'suspended',
}

/**
 * Subscription plan tiers
 */
export enum SubscriptionPlan {
  Free = 'free',
  Starter = 'starter',
  Regular = 'regular',
  Agency = 'agency',
  Pro = 'pro',
  Golden = 'golden',
  Platinum = 'platinum',
}

/**
 * Subscription billing type
 */
export enum SubscriptionType {
  Commission = 'commission',
  Yearly = 'yearly',
}

/**
 * KYC document verification status
 */
export enum VerificationStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

/**
 * Mandat Minute proof status
 */
export enum MandatProofStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

/**
 * Fraud report status
 */
export enum ReportStatus {
  Open = 'open',
  Investigating = 'investigating',
  Resolved = 'resolved',
  Dismissed = 'dismissed',
}

/**
 * Order status
 */
export enum OrderStatus {
  PaymentRequired = 'payment_required',
  Pending = 'pending',
  Processing = 'processing',
  Fulfilled = 'fulfilled',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
  Refunded = 'refunded',
}

/**
 * Wallet transaction types
 */
export enum WalletTransactionType {
  Sale = 'sale',
  Commission = 'commission',
  Payout = 'payout',
  Refund = 'refund',
  AddonPurchase = 'addon_purchase',
}

/**
 * Payout mode for vendor wallet
 */
export enum PayoutMode {
  Automatic = 'automatic',
  OnDemand = 'on_demand',
}

/**
 * Shipping mode
 */
export enum ShippingMode {
  SelfManaged = 'self_managed',
  PlatformUnified = 'platform_unified',
}

/**
 * Payment gateways
 */
export enum PaymentGateway {
  Flouci = 'flouci',
  Konnect = 'konnect',
  MandatMinute = 'mandat_minute',
  CashOnDelivery = 'cod',
}

/**
 * Product types
 */
export enum ProductType {
  Physical = 'physical',
  Digital = 'digital',
  Service = 'service',
}

/**
 * Mandat proof uploader
 */
export enum MandatUploader {
  Buyer = 'buyer',
  Vendor = 'vendor',
}

/**
 * User roles
 */
export enum UserRole {
  Customer = 'customer',
  Vendor = 'vendor',
  VendorVerified = 'vendor_verified',
  Admin = 'admin',
  SuperAdmin = 'super_admin',
}

/**
 * Notification types
 */
export enum NotificationType {
  OrderPlaced = 'order_placed',
  PaymentCaptured = 'payment_captured',
  MandatApproved = 'mandat_approved',
  MandatRejected = 'mandat_rejected',
  OrderFulfilled = 'order_fulfilled',
  OrderCancelled = 'order_cancelled',
  KycSubmitted = 'kyc_submitted',
  KycApproved = 'kyc_approved',
  KycRejected = 'kyc_rejected',
  ProductApproved = 'product_approved',
  ProductRejected = 'product_rejected',
  AiJobCompleted = 'ai_job_completed',
  AiJobFailed = 'ai_job_failed',
  CreditsDepleted = 'credits_depleted',
  WalletFundsAvailable = 'wallet_funds_available',
  PayoutCompleted = 'payout_completed',
  StockLow = 'stock_low',
  ReportCreated = 'report_created',
  StoreSuspended = 'store_suspended',
  SubscriptionExpiring = 'subscription_expiring',
  SubscriptionExpired = 'subscription_expired',
}

/**
 * PandaMarket event names (event bus)
 */
export const PD_EVENTS = {
  STORE_CREATED: 'pd.store.created',
  STORE_UPDATED: 'pd.store.updated',
  STORE_SUSPENDED: 'pd.store.suspended',
  ORDER_PLACED: 'pd.order.placed',
  ORDER_FULFILLED: 'pd.order.fulfilled',
  ORDER_CANCELLED: 'pd.order.cancelled',
  PAYMENT_CAPTURED: 'pd.payment.captured',
  PAYMENT_REFUNDED: 'pd.payment.refunded',
  PAYMENT_ERROR: 'pd.payment.error',
  MANDAT_UPLOADED: 'pd.mandat.uploaded',
  MANDAT_APPROVED: 'pd.mandat.approved',
  MANDAT_REJECTED: 'pd.mandat.rejected',
  PRODUCT_CREATED: 'pd.product.created',
  PRODUCT_PUBLISHED: 'pd.product.published',
  PRODUCT_PENDING_APPROVAL: 'pd.product.pending_approval',
  PRODUCT_APPROVED: 'pd.product.approved',
  PRODUCT_REJECTED: 'pd.product.rejected',
  VERIFICATION_SUBMITTED: 'pd.verification.submitted',
  VERIFICATION_APPROVED: 'pd.verification.approved',
  VERIFICATION_REJECTED: 'pd.verification.rejected',
  AI_JOB_COMPLETED: 'pd.ai.job.completed',
  AI_JOB_FAILED: 'pd.ai.job.failed',
  CREDITS_DEPLETED: 'pd.credits.depleted',
  WALLET_FUNDS_AVAILABLE: 'pd.wallet.funds_available',
  WALLET_WITHDRAWAL_REQUESTED: 'pd.wallet.withdrawal_requested',
  WALLET_PAYOUT_COMPLETED: 'pd.wallet.payout_completed',
  STOCK_LOW: 'pd.stock.low',
  REPORT_CREATED: 'pd.report.created',
  TRACKING_UPDATED: 'pd.tracking.updated',
  SUBSCRIPTION_EXPIRED: 'pd.subscription.expired',
} as const;

/**
 * Plan-specific limits configuration
 */
export const PLAN_LIMITS = {
  [SubscriptionPlan.Free]: {
    maxProducts: 10,
    maxImagesPerProduct: 2,
    commissionRate: 0.15,
    hasAiSeo: false,
    hasImageCompression: false,
    hasCustomDomain: false,
    hasPageBuilder: false,
    hasDirectPayment: false,
    hasWhiteLabel: false,
    hasApiKeys: false,
    aiTokensIncluded: 0,
    yearlyPrice: 0,
  },
  [SubscriptionPlan.Starter]: {
    maxProducts: 50,
    maxImagesPerProduct: 5,
    commissionRate: 0,
    hasAiSeo: true,
    hasImageCompression: true,
    hasCustomDomain: true,
    hasPageBuilder: false,
    hasDirectPayment: false,
    hasWhiteLabel: false,
    hasApiKeys: false,
    aiTokensIncluded: 50,
    yearlyPrice: 300,
  },
  [SubscriptionPlan.Regular]: {
    maxProducts: 100,
    maxImagesPerProduct: 7,
    commissionRate: 0,
    hasAiSeo: true,
    hasImageCompression: true,
    hasCustomDomain: true,
    hasPageBuilder: true,
    hasDirectPayment: false,
    hasWhiteLabel: false,
    hasApiKeys: false,
    aiTokensIncluded: 100,
    yearlyPrice: 600,
  },
  [SubscriptionPlan.Agency]: {
    maxProducts: 300,
    maxImagesPerProduct: 10,
    commissionRate: 0,
    hasAiSeo: true,
    hasImageCompression: true,
    hasCustomDomain: true,
    hasPageBuilder: true,
    hasDirectPayment: false,
    hasWhiteLabel: false,
    hasApiKeys: true,
    aiTokensIncluded: 300,
    yearlyPrice: 1200,
  },
  [SubscriptionPlan.Pro]: {
    maxProducts: -1, // unlimited
    maxImagesPerProduct: 15,
    commissionRate: 0,
    hasAiSeo: true,
    hasImageCompression: true,
    hasCustomDomain: true,
    hasPageBuilder: true,
    hasDirectPayment: true,
    hasWhiteLabel: false,
    hasApiKeys: true,
    aiTokensIncluded: -1, // unlimited
    yearlyPrice: 2400,
  },
  [SubscriptionPlan.Golden]: {
    maxProducts: -1,
    maxImagesPerProduct: 20,
    commissionRate: 0,
    hasAiSeo: true,
    hasImageCompression: true,
    hasCustomDomain: true,
    hasPageBuilder: true,
    hasDirectPayment: true,
    hasWhiteLabel: false,
    hasApiKeys: true,
    aiTokensIncluded: -1,
    yearlyPrice: 4800,
  },
  [SubscriptionPlan.Platinum]: {
    maxProducts: -1,
    maxImagesPerProduct: 30,
    commissionRate: 0,
    hasAiSeo: true,
    hasImageCompression: true,
    hasCustomDomain: true,
    hasPageBuilder: true,
    hasDirectPayment: true,
    hasWhiteLabel: true,
    hasApiKeys: true,
    aiTokensIncluded: -1,
    yearlyPrice: 9600,
  },
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  AUTH_LOGIN: { max: 5, windowMs: 15 * 60 * 1000 },
  AUTH_REGISTER: { max: 3, windowMs: 60 * 60 * 1000 },
  AUTH_FORGOT_PASSWORD: { max: 3, windowMs: 60 * 60 * 1000 },
  PUBLIC_API: { max: 100, windowMs: 60 * 1000 },
  AUTHENTICATED_API: { max: 60, windowMs: 60 * 1000 },
  API_KEY: { max: 120, windowMs: 60 * 1000 },
  FILE_UPLOAD: { max: 10, windowMs: 5 * 60 * 1000 },
} as const;

/**
 * File upload constraints
 */
export const FILE_CONSTRAINTS = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10 MB
  MAX_DIGITAL_PRODUCT_SIZE: 50 * 1024 * 1024, // 50 MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_KYC_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  ALLOWED_IMPORT_TYPES: ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  PRESIGNED_URL_EXPIRY_UPLOAD: 900, // 15 minutes
  PRESIGNED_URL_EXPIRY_DOWNLOAD: 3600, // 1 hour
} as const;

/**
 * S3 bucket names
 */
export const S3_BUCKETS = {
  PUBLIC_IMAGES: process.env.PD_S3_BUCKET_PUBLIC || 'pd-product-images',
  PRIVATE_FILES: process.env.PD_S3_BUCKET_PRIVATE || 'pd-private-files',
  THEMES: process.env.PD_S3_BUCKET_THEMES || 'pd-themes',
} as const;

/**
 * JWT configuration
 */
export const JWT_CONFIG = {
  ACCESS_EXPIRY: process.env.PD_JWT_EXPIRY || '15m',
  REFRESH_EXPIRY: process.env.PD_REFRESH_TOKEN_EXPIRY || '7d',
} as const;

/**
 * Retention periods (in days) for wallet funds
 */
export const RETENTION_DAYS = {
  FLOUCI: 7,
  KONNECT: 7,
  MANDAT_MINUTE: 14,
  COD: 0, // after delivery confirmation
} as const;

/**
 * TND currency precision (3 decimal places)
 */
export const TND_PRECISION = 3;
