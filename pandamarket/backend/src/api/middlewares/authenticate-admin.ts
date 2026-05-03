import { NextFunction } from 'express';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PdAuthenticationError, PdForbiddenError } from '../../utils/errors';
import jwt from 'jsonwebtoken';

const ADMIN_ROLES = ['admin', 'super_admin'];

export const authenticateAdmin = async (
  req: MedusaRequest,
  _res: MedusaResponse,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Missing or invalid Authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwtSecret = process.env.PD_JWT_SECRET || process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Authentication configuration error'));
    }

    const decoded = jwt.verify(token, jwtSecret) as Record<string, unknown>;

    if (!decoded.sub) {
      return next(new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Token does not contain user identity'));
    }

    const role = decoded.role as string | undefined;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return next(new PdForbiddenError('PD_PERM_FORBIDDEN', 'Admin access required'));
    }

    (req as Record<string, unknown>).pd_user_id = decoded.sub as string;
    (req as Record<string, unknown>).pd_role = role;

    next();
  } catch (error) {
    if (error instanceof (jwt as typeof jwt).TokenExpiredError) {
      return next(new PdAuthenticationError('PD_AUTH_TOKEN_EXPIRED', 'Token has expired'));
    }
    return next(new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Invalid token'));
  }
};
