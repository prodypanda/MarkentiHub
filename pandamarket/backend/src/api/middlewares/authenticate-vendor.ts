// pandamarket/backend/src/api/middlewares/authenticate-vendor.ts
// =============================================================================
// PandaMarket — Vendor JWT Authentication Middleware
// Verifies Bearer token using PD_JWT_SECRET (fail-fast if missing).
// Populates req.pd_store_id, req.pd_user_id, req.pd_role on success.
// =============================================================================

import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';
import jwt from 'jsonwebtoken';

import { PdAuthenticationError, PdTokenExpiredError } from '../../utils/errors';
import { UserRole } from '../../utils/constants';

export interface PdJwtPayload {
  sub: string;
  store_id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Resolve the JWT secret from env. Fails fast in production if missing.
 * In non-production we allow a dev secret to keep local DX working,
 * but it must be explicitly set via PD_JWT_SECRET.
 */
function getJwtSecret(): string {
  const secret = process.env.PD_JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'PD_JWT_SECRET environment variable is not set or is too short (>= 16 chars required).',
    );
  }
  return secret;
}

export const authenticateVendor = async (
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new PdAuthenticationError(
        'PD_AUTH_TOKEN_INVALID',
        'Missing or invalid Authorization header',
      ),
    );
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    return next(new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Empty bearer token'));
  }

  let decoded: PdJwtPayload;
  try {
    decoded = jwt.verify(token, getJwtSecret()) as PdJwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new PdTokenExpiredError());
    }
    return next(new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Invalid token'));
  }

  if (!decoded.sub) {
    return next(new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Token missing subject'));
  }

  if (!decoded.store_id) {
    return next(
      new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Token does not contain store_id'),
    );
  }

  // Inject canonical PandaMarket auth context — always pd_* prefixed.
  (req as unknown as Record<string, unknown>).pd_store_id = decoded.store_id;
  (req as unknown as Record<string, unknown>).pd_user_id = decoded.sub;
  (req as unknown as Record<string, unknown>).pd_role = decoded.role ?? UserRole.Vendor;

  return next();
};
