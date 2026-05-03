// pandamarket/backend/src/api/middlewares/require-admin.ts
// =============================================================================
// PandaMarket — Admin Guard Middleware
// Must be applied AFTER authenticateVendor on /api/pd/admin/* routes.
// =============================================================================

import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';

import { PdForbiddenError } from '../../utils/errors';
import { UserRole } from '../../utils/constants';

export const requireAdmin = async (
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction,
): Promise<void> => {
  const role = (req as unknown as { pd_role?: UserRole }).pd_role;
  if (role !== UserRole.Admin && role !== UserRole.SuperAdmin) {
    return next(new PdForbiddenError('PD_PERM_FORBIDDEN', 'Accès réservé aux administrateurs'));
  }
  return next();
};
