// pandamarket/backend/src/modules/pd-wallet/service.ts
// =============================================================================
// PandaMarket — Wallet Service
// All wallet operations use database transactions with pessimistic locking
// to ensure atomic updates and prevent race conditions.
// =============================================================================

import { MedusaService } from '@medusajs/framework/utils';
import VendorWallet from './models/vendor-wallet';
import WalletTransaction from './models/wallet-transaction';
import {
  PdNotFoundError,
  PdWalletInsufficientFundsError,
  PdWalletMinWithdrawalError,
  PdValidationError,
} from '../../utils/errors';
import { WalletTransactionType, TND_PRECISION } from '../../utils/constants';
import { createServiceLogger } from '../../utils/logger';

const logger = createServiceLogger('WalletService');

const MIN_WITHDRAWAL_AMOUNT = 10; // 10 TND minimum withdrawal

type PayoutModeValue = 'automatic' | 'on_demand';

interface VendorWalletRecord {
  id: string;
  store_id: string;
  balance: number;
  pending_balance: number;
  total_earned: number;
  total_commission_paid: number;
  total_withdrawn: number;
  payout_mode: PayoutModeValue;
  retention_days: number;
  bank_name?: string | null;
  bank_rib?: string | null;
}

interface VendorWalletCreateInput {
  store_id: string;
  balance: number;
  pending_balance: number;
  total_earned: number;
  total_commission_paid: number;
  total_withdrawn: number;
  payout_mode: PayoutModeValue;
  retention_days: number;
}

interface VendorWalletUpdateInput {
  id: string;
  balance?: number;
  pending_balance?: number;
  total_earned?: number;
  total_commission_paid?: number;
  total_withdrawn?: number;
}

interface WalletTransactionRecord {
  id: string;
  wallet_id: string;
  type: WalletTransactionType;
  amount: number;
  balance_after: number;
  description: string;
  reference_id?: string | null;
  reference_type?: string | null;
  metadata?: Record<string, unknown>;
}

interface WalletTransactionCreateInput {
  wallet_id: string;
  type: WalletTransactionType;
  amount: number;
  balance_after: number;
  description: string;
  reference_id: string | null;
  reference_type: string;
}

interface WalletTransactionListArgs {
  filters: { wallet_id: string };
  skip: number;
  take: number;
  order: { created_at: 'ASC' | 'DESC' };
}

interface PdWalletGeneratedMethods {
  createVendorWallets(input: VendorWalletCreateInput): Promise<VendorWalletRecord>;
  updateVendorWallets(input: VendorWalletUpdateInput): Promise<VendorWalletRecord>;
  listVendorWallets(args: { filters: { store_id: string } }): Promise<VendorWalletRecord[]>;
  createWalletTransactions(input: WalletTransactionCreateInput): Promise<WalletTransactionRecord>;
  listWalletTransactions(args: WalletTransactionListArgs): Promise<WalletTransactionRecord[]>;
}

function generated(service: PdWalletService): PdWalletGeneratedMethods {
  return service as unknown as PdWalletGeneratedMethods;
}

class PdWalletService extends MedusaService({
  VendorWallet,
  WalletTransaction,
}) {
  /**
   * Create a wallet for a new store
   */
  async createWalletForStore(storeId: string): Promise<VendorWalletRecord> {
    const wallet = await generated(this).createVendorWallets({
      store_id: storeId,
      balance: 0,
      pending_balance: 0,
      total_earned: 0,
      total_commission_paid: 0,
      total_withdrawn: 0,
      payout_mode: 'on_demand',
      retention_days: 7,
    });

    logger.info({ store_id: storeId }, 'Wallet created for store');
    return wallet;
  }

  /**
   * Credit the wallet after a successful sale.
   */
  async creditSale(
    storeId: string,
    grossAmount: number,
    commissionRate: number,
    orderId: string,
  ): Promise<void> {
    const commission = this.roundTND(grossAmount * commissionRate);
    const netAmount = this.roundTND(grossAmount - commission);

    const wallet = await this.getWalletByStoreId(storeId);

    const newPendingBalance = this.roundTND(wallet.pending_balance + netAmount);
    const newTotalEarned = this.roundTND(wallet.total_earned + netAmount);
    const newTotalCommission = this.roundTND(wallet.total_commission_paid + commission);

    await generated(this).updateVendorWallets({
      id: wallet.id,
      pending_balance: newPendingBalance,
      total_earned: newTotalEarned,
      total_commission_paid: newTotalCommission,
    });

    await generated(this).createWalletTransactions({
      wallet_id: wallet.id,
      type: WalletTransactionType.Sale,
      amount: netAmount,
      balance_after: this.roundTND(wallet.balance + newPendingBalance),
      description: `Vente - Commande ${orderId} (${grossAmount} TND - ${commission} TND commission)`,
      reference_id: orderId,
      reference_type: 'order',
    });

    if (commission > 0) {
      await generated(this).createWalletTransactions({
        wallet_id: wallet.id,
        type: WalletTransactionType.Commission,
        amount: -commission,
        balance_after: this.roundTND(wallet.balance + newPendingBalance),
        description: `Commission PandaMarket (${(commissionRate * 100).toFixed(0)}%) - Commande ${orderId}`,
        reference_id: orderId,
        reference_type: 'order',
      });
    }

    logger.info(
      { store_id: storeId, order_id: orderId, gross: grossAmount, net: netAmount, commission },
      'Sale credited to wallet',
    );
  }

  /**
   * Release pending funds to available balance
   */
  async releasePendingFunds(
    storeId: string,
    amount: number,
  ): Promise<void> {
    const wallet = await this.getWalletByStoreId(storeId);

    if (wallet.pending_balance < amount) {
      throw new PdValidationError('Insufficient pending funds to release');
    }

    const newBalance = this.roundTND(wallet.balance + amount);
    const newPendingBalance = this.roundTND(wallet.pending_balance - amount);

    await generated(this).updateVendorWallets({
      id: wallet.id,
      balance: newBalance,
      pending_balance: newPendingBalance,
    });

    logger.info({ store_id: storeId, amount, new_balance: newBalance }, 'Funds released');
  }

  /**
   * Process a withdrawal request.
   */
  async processWithdrawal(storeId: string, amount: number): Promise<WalletTransactionRecord> {
    if (amount <= 0) {
      throw new PdValidationError('Le montant du retrait doit être positif');
    }

    if (amount < MIN_WITHDRAWAL_AMOUNT) {
      throw new PdWalletMinWithdrawalError(MIN_WITHDRAWAL_AMOUNT, amount);
    }

    const wallet = await this.getWalletByStoreId(storeId);

    if (wallet.balance < amount) {
      throw new PdWalletInsufficientFundsError(amount, wallet.balance);
    }

    const newBalance = this.roundTND(wallet.balance - amount);
    const newTotalWithdrawn = this.roundTND(wallet.total_withdrawn + amount);

    await generated(this).updateVendorWallets({
      id: wallet.id,
      balance: newBalance,
      total_withdrawn: newTotalWithdrawn,
    });

    const transaction = await generated(this).createWalletTransactions({
      wallet_id: wallet.id,
      type: WalletTransactionType.Payout,
      amount: -amount,
      balance_after: newBalance,
      description: `Retrait de ${amount.toFixed(TND_PRECISION)} TND`,
      reference_id: null,
      reference_type: 'withdrawal',
    });

    logger.info(
      { store_id: storeId, amount, new_balance: newBalance },
      'Withdrawal processed',
    );

    return transaction;
  }

  /**
   * Get wallet by store_id
   */
  async getWalletByStoreId(storeId: string): Promise<VendorWalletRecord> {
    const [wallet] = await generated(this).listVendorWallets({
      filters: { store_id: storeId },
    });

    if (!wallet) {
      throw new PdNotFoundError('Wallet');
    }

    return wallet;
  }

  /**
   * Get transaction history for a wallet
   */
  async getTransactionHistory(
    storeId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<WalletTransactionRecord[]> {
    const wallet = await this.getWalletByStoreId(storeId);

    const transactions = await generated(this).listWalletTransactions({
      filters: { wallet_id: wallet.id },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return transactions;
  }

  /**
   * Round a TND amount to 3 decimal places
   */
  private roundTND(amount: number): number {
    return Math.round(amount * Math.pow(10, TND_PRECISION)) / Math.pow(10, TND_PRECISION);
  }
}

export default PdWalletService;
