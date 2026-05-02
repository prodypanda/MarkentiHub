// @ts-nocheck
// pandamarket/backend/src/api/routes/pd/wallet/route.ts
// =============================================================================
// PandaMarket — Wallet Routes
// GET  /api/pd/wallet              → Get wallet balance
// GET  /api/pd/wallet/transactions → Get transaction history
// POST /api/pd/wallet/withdraw     → Request withdrawal
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PdForbiddenError } from '../../../../utils/errors';

/**
 * GET /api/pd/wallet
 * Get the authenticated vendor's wallet balance
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const storeId = (req as Record<string, unknown>).pd_store_id as string;

  if (!storeId) {
    throw new PdForbiddenError();
  }

  const pdWalletService = req.scope.resolve('pdWalletService');
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
  const storeId = (req as Record<string, unknown>).pd_store_id as string;

  if (!storeId) {
    throw new PdForbiddenError();
  }

  const body = (req as Record<string, unknown>).validatedBody as { amount: number };

  const pdWalletService = req.scope.resolve('pdWalletService');
  const transaction = await pdWalletService.processWithdrawal(storeId, body.amount);

  res.status(201).json({ transaction });
}
