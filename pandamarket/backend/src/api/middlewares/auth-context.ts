// pandamarket/backend/src/api/middlewares/auth-context.ts
// =============================================================================
// PandaMarket — Auth Context Helpers
// Single source of truth for extracting authenticated store/user from req.
// Always read pd_store_id / pd_user_id / pd_role — never from req.body.
// =============================================================================

import type { MedusaRequest } from '@medusajs/framework/http';

import { PdForbiddenError } from '../../utils/errors';
import { UserRole } from '../../utils/constants';

/**
 * Shape injected by `authenticateVendor` / `authenticateApiKey`.
 */
export interface PdAuthContext {
  storeId: string;
  userId?: string;
  role?: UserRole;
  scopes?: string[];
}

/**
 * Best-effort read of auth context. Returns undefined fields when not set.
 * Do not call this unless you're on a route protected by auth middleware.
 */
export function getAuthContext(req: MedusaRequest): PdAuthContext | null {
  const r = req as unknown as {
    pd_store_id?: string;
    pd_user_id?: string;
    pd_role?: UserRole;
    pd_scopes?: string[];
  };
  if (!r.pd_store_id) return null;
  return {
    storeId: r.pd_store_id,
    userId: r.pd_user_id,
    role: r.pd_role,
    scopes: r.pd_scopes,
  };
}

/**
 * Strict read: throws PdForbiddenError if no authenticated store context is present.
 * Use this at the top of every vendor-scoped route handler.
 */
export function requireStoreContext(req: MedusaRequest): PdAuthContext {
  const ctx = getAuthContext(req);
  if (!ctx || !ctx.storeId) {
    throw new PdForbiddenError();
  }
  return ctx;
}

/**
 * Strict read: throws PdForbiddenError unless the caller is Admin or SuperAdmin.
 */
export function requireAdminContext(req: MedusaRequest): PdAuthContext {
  const ctx = getAuthContext(req);
  if (!ctx || !ctx.userId) {
    throw new PdForbiddenError();
  }
  if (ctx.role !== UserRole.Admin && ctx.role !== UserRole.SuperAdmin) {
    throw new PdForbiddenError('PD_PERM_FORBIDDEN', 'Accès réservé aux administrateurs');
  }
  return ctx;
}

/**
 * Assert that a resource's owning store matches the authenticated store.
 * Used to enforce tenant isolation on write routes.
 */
export function assertOwnsStore(req: MedusaRequest, resourceStoreId: string): PdAuthContext {
  const ctx = requireStoreContext(req);
  if (ctx.storeId !== resourceStoreId) {
    throw new PdForbiddenError('PD_PERM_NOT_OWNER', 'Vous ne pouvez accéder qu\'à vos propres ressources');
  }
  return ctx;
}
