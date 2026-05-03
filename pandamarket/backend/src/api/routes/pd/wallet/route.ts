// pandamarket/backend/src/api/routes/pd/wallet/route.ts
// =============================================================================
// PandaMarket — Wallet Routes
// GET  /api/pd/wallet              → Get wallet balance
// GET  /api/pd/wallet/transactions → Get transaction history
// POST /api/pd/wallet/withdraw     → Request withdrawal
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';

import { requireStoreContext } from '../../../middlewares/auth-context';
import { PdValidationError } from '../../../../utils/errors';

const withdrawalSchema = z.object({
  amount: z.coerce.number().positive(),
});

interface WalletLike {
  balance: number;
  pending_balance: number;
  total_earned: number;
  total_commission_paid: number;
  total_withdrawn: number;
  payout_mode: string;
  retention_days: number;
}

interface IPdWalletService {
  getWalletByStoreId(storeId: string): Promise<WalletLike>;
  processWithdrawal(storeId: string, amount: number): Promise<unknown>;
}

function validationFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  error.issues.forEach((issue) => {
    fields[issue.path.join('.')] = issue.message;
  });
  return fields;
}

/**
 * GET /api/pd/wallet
 * Get the authenticated vendor's wallet balance
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const { storeId } = requireStoreContext(req);

  const pdWalletService = req.scope.resolve<IPdWalletService>('pdWalletService');
  const wallet = await pdWalletService.getWalletByStoreId(storeId);

  res.json({
    wallet: {
      balance: wallet.balance,
      pending_balance: wallet.pending_balance,
      total_earned: wallet.total_earned,
      total_commission_paid: wallet.total_commission_paid,
      total_withdrawn: wallet.total_withdrawn,
      payout_mode: wallet.payout_mode,
      retention_days: wallet.retention_days,
    },
  });
}

/**
 * POST /api/pd/wallet/withdraw
 * Request a withdrawal from the wallet
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const { storeId } = requireStoreContext(req);

  const parsed = withdrawalSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }

  const pdWalletService = req.scope.resolve<IPdWalletService>('pdWalletService');
  const transaction = await pdWalletService.processWithdrawal(storeId, parsed.data.amount);

  res.status(201).json({ transaction });
}
