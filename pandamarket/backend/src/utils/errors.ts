// pandamarket/backend/src/utils/errors.ts
// =============================================================================
// PandaMarket — Custom Error Classes
// All errors use the PD_* code format and never expose internal details.
// =============================================================================

export interface IPdErrorDetails {
  [key: string]: unknown;
}

/**
 * Base error class for all PandaMarket errors.
 * Every custom error extends this class.
 */
export class PdError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: IPdErrorDetails;
  public readonly timestamp: string;

  constructor(
    code: string,
    message: string,
    statusCode: number,
    details: IPdErrorDetails = {},
  ) {
    super(message);
    this.name = 'PdError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Returns a safe JSON representation for API responses.
   * Never includes stack traces or internal info.
   */
  toJSON(): Record<string, unknown> {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

// =============================================================================
// Authentication Errors (PD_AUTH_*)
// =============================================================================

export class PdAuthenticationError extends PdError {
  constructor(
    code: string = 'PD_AUTH_INVALID_CREDENTIALS',
    message: string = 'Email ou mot de passe incorrect',
    details: IPdErrorDetails = {},
  ) {
    super(code, message, 401, details);
    this.name = 'PdAuthenticationError';
  }
}

export class PdTokenExpiredError extends PdError {
  constructor() {
    super(
      'PD_AUTH_TOKEN_EXPIRED',
      'Session expirée, veuillez vous reconnecter',
      401,
    );
    this.name = 'PdTokenExpiredError';
  }
}

// =============================================================================
// Validation Errors (PD_VALIDATION_*)
// =============================================================================

export class PdValidationError extends PdError {
  constructor(
    message: string = 'Données invalides',
    details: IPdErrorDetails = {},
  ) {
    super('PD_VALIDATION_ERROR', message, 400, details);
    this.name = 'PdValidationError';
  }
}

// =============================================================================
// Permission Errors (PD_PERM_*)
// =============================================================================

export class PdForbiddenError extends PdError {
  constructor(
    code: string = 'PD_PERM_FORBIDDEN',
    message: string = "Vous n'avez pas les droits pour cette action",
    details: IPdErrorDetails = {},
  ) {
    super(code, message, 403, details);
    this.name = 'PdForbiddenError';
  }
}

export class PdNotOwnerError extends PdError {
  constructor(resourceId?: string) {
    super(
      'PD_PERM_NOT_OWNER',
      'Vous ne pouvez modifier que vos propres ressources',
      403,
      resourceId ? { resource_id: resourceId } : {},
    );
    this.name = 'PdNotOwnerError';
  }
}

export class PdPlanRequiredError extends PdError {
  constructor(requiredPlan: string, currentPlan: string) {
    super(
      'PD_PERM_PLAN_REQUIRED',
      `Cette fonctionnalité nécessite le plan ${requiredPlan} minimum`,
      403,
      { required_plan: requiredPlan, current_plan: currentPlan },
    );
    this.name = 'PdPlanRequiredError';
  }
}

// =============================================================================
// Not Found Errors (PD_*_NOT_FOUND)
// =============================================================================

export class PdNotFoundError extends PdError {
  constructor(
    resource: string = 'Ressource',
    details: IPdErrorDetails = {},
  ) {
    super('PD_NOT_FOUND', `${resource} introuvable`, 404, details);
    this.name = 'PdNotFoundError';
  }
}

// =============================================================================
// Store Errors (PD_STORE_*)
// =============================================================================

export class PdStoreNotFoundError extends PdError {
  constructor(storeId: string) {
    super('PD_STORE_NOT_FOUND', 'Boutique introuvable', 404, {
      store_id: storeId,
    });
    this.name = 'PdStoreNotFoundError';
  }
}

export class PdSubdomainTakenError extends PdError {
  constructor(subdomain: string) {
    super(
      'PD_STORE_SUBDOMAIN_TAKEN',
      'Ce sous-domaine est déjà utilisé',
      409,
      { subdomain },
    );
    this.name = 'PdSubdomainTakenError';
  }
}

export class PdStoreSuspendedError extends PdError {
  constructor(storeId: string) {
    super('PD_STORE_SUSPENDED', 'Cette boutique est suspendue', 403, {
      store_id: storeId,
    });
    this.name = 'PdStoreSuspendedError';
  }
}

// =============================================================================
// Product Errors (PD_PRODUCT_*)
// =============================================================================

export class PdProductQuotaExceededError extends PdError {
  constructor(current: number, limit: number, plan: string) {
    super(
      'PD_PRODUCT_QUOTA_EXCEEDED',
      'Limite de produits atteinte pour votre plan',
      403,
      { current, limit, plan },
    );
    this.name = 'PdProductQuotaExceededError';
  }
}

export class PdImageQuotaExceededError extends PdError {
  constructor(current: number, limit: number, plan: string) {
    super(
      'PD_PRODUCT_IMAGE_QUOTA',
      "Limite d'images par produit atteinte",
      403,
      { current, limit, plan },
    );
    this.name = 'PdImageQuotaExceededError';
  }
}

// =============================================================================
// Wallet Errors (PD_WALLET_*)
// =============================================================================

export class PdWalletInsufficientFundsError extends PdError {
  constructor(requested: number, available: number) {
    super(
      'PD_WALLET_INSUFFICIENT_FUNDS',
      'Solde insuffisant pour ce retrait',
      400,
      { requested, available },
    );
    this.name = 'PdWalletInsufficientFundsError';
  }
}

export class PdWalletMinWithdrawalError extends PdError {
  constructor(min: number, requested: number) {
    super(
      'PD_WALLET_MIN_WITHDRAWAL',
      'Montant minimum de retrait non atteint',
      400,
      { min, requested },
    );
    this.name = 'PdWalletMinWithdrawalError';
  }
}

// =============================================================================
// Payment Errors (PD_PAY_*)
// =============================================================================

export class PdPaymentInitError extends PdError {
  constructor(gateway: string, reason: string) {
    super(
      'PD_PAY_INIT_FAILED',
      "Impossible d'initialiser le paiement",
      502,
      { gateway, reason },
    );
    this.name = 'PdPaymentInitError';
  }
}

export class PdPaymentAlreadyCapturedError extends PdError {
  constructor(paymentId: string) {
    super(
      'PD_PAY_ALREADY_CAPTURED',
      'Ce paiement a déjà été capturé',
      409,
      { payment_id: paymentId },
    );
    this.name = 'PdPaymentAlreadyCapturedError';
  }
}

// =============================================================================
// KYC Errors (PD_KYC_*)
// =============================================================================

export class PdKycAlreadySubmittedError extends PdError {
  constructor(submittedAt: string) {
    super(
      'PD_KYC_ALREADY_SUBMITTED',
      'Documents déjà soumis, en attente de validation',
      409,
      { submitted_at: submittedAt },
    );
    this.name = 'PdKycAlreadySubmittedError';
  }
}

export class PdKycAlreadyVerifiedError extends PdError {
  constructor() {
    super(
      'PD_KYC_ALREADY_VERIFIED',
      'Votre boutique est déjà vérifiée',
      409,
    );
    this.name = 'PdKycAlreadyVerifiedError';
  }
}

// =============================================================================
// AI & Credits Errors (PD_AI_*)
// =============================================================================

export class PdInsufficientTokensError extends PdError {
  constructor(required: number, available: number) {
    super(
      'PD_AI_INSUFFICIENT_TOKENS',
      'Crédits IA insuffisants',
      403,
      { required, available },
    );
    this.name = 'PdInsufficientTokensError';
  }
}

// =============================================================================
// Subscription Errors (PD_SUB_*)
// =============================================================================

export class PdSubscriptionDowngradeBlockedError extends PdError {
  constructor(productsCount: number, newLimit: number) {
    super(
      'PD_SUB_DOWNGRADE_BLOCKED',
      'Impossible de downgrader : vous dépassez les limites du plan inférieur',
      400,
      { products_count: productsCount, new_limit: newLimit },
    );
    this.name = 'PdSubscriptionDowngradeBlockedError';
  }
}

// =============================================================================
// API Key Errors (PD_KEY_*)
// =============================================================================

export class PdApiKeyInvalidError extends PdError {
  constructor() {
    super('PD_KEY_INVALID', 'Clé API invalide ou révoquée', 401);
    this.name = 'PdApiKeyInvalidError';
  }
}

export class PdApiKeyScopeDeniedError extends PdError {
  constructor(requiredScope: string) {
    super(
      'PD_KEY_SCOPE_DENIED',
      "Cette clé n'a pas les permissions requises",
      403,
      { required_scope: requiredScope },
    );
    this.name = 'PdApiKeyScopeDeniedError';
  }
}

// =============================================================================
// File Errors (PD_FILE_*)
// =============================================================================

export class PdFileTooLargeError extends PdError {
  constructor(maxSize: string, actual: number) {
    super('PD_FILE_TOO_LARGE', 'Fichier trop volumineux', 400, {
      max: maxSize,
      actual,
    });
    this.name = 'PdFileTooLargeError';
  }
}

export class PdFileInvalidTypeError extends PdError {
  constructor(validTypes: string[]) {
    super(
      'PD_FILE_INVALID_TYPE',
      'Type de fichier non autorisé',
      400,
      { valid_types: validTypes },
    );
    this.name = 'PdFileInvalidTypeError';
  }
}

// =============================================================================
// Rate Limit Errors (PD_RATE_*)
// =============================================================================

export class PdRateLimitError extends PdError {
  constructor(retryAfter: number) {
    super(
      'PD_RATE_LIMITED',
      'Trop de requêtes, réessayez plus tard',
      429,
      { retry_after: retryAfter },
    );
    this.name = 'PdRateLimitError';
  }
}

// =============================================================================
// Conflict Error (PD_CONFLICT)
// =============================================================================

export class PdConflictError extends PdError {
  constructor(
    code: string = 'PD_CONFLICT',
    message: string = 'Conflit de données',
    details: IPdErrorDetails = {},
  ) {
    super(code, message, 409, details);
    this.name = 'PdConflictError';
  }
}

// =============================================================================
// Internal Error (PD_INTERNAL)
// =============================================================================

export class PdInternalError extends PdError {
  constructor(requestId?: string) {
    super(
      'PD_INTERNAL_ERROR',
      'Erreur interne du serveur',
      500,
      requestId ? { request_id: requestId } : {},
    );
    this.name = 'PdInternalError';
  }
}
