import { NextFunction } from 'express';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PdAuthenticationError, PdTokenExpiredError } from '../../utils/errors';
import jwt from 'jsonwebtoken';

export const authenticateVendor = async (
  req: MedusaRequest,
  _res: MedusaResponse,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Missing or invalid Authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as any;
    
    // Inject vendor context
    if (!decoded.store_id) {
       return next(new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Token does not contain store_id'));
    }
    
    (req as any).pd_store_id = decoded.store_id;
    (req as any).user_id = decoded.sub;
    (req as any).role = decoded.role;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new PdTokenExpiredError());
    }
    return next(new PdAuthenticationError('PD_AUTH_TOKEN_INVALID', 'Invalid token'));
  }
};
