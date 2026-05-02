// pandamarket/backend/src/modules/pd-wallet/models/wallet-transaction.ts
import { model } from '@medusajs/framework/utils';

const WalletTransaction = model.define('pd_wallet_transaction', {
  id: model.id().primaryKey(),
  wallet_id: model.text(),
  type: model.enum(['sale', 'commission', 'payout', 'refund', 'addon_purchase']),
  amount: model.float(),
  balance_after: model.float(),
  description: model.text(),
  reference_id: model.text().nullable(),
  reference_type: model.text().nullable(),
  metadata: model.json().default({}),
})
.indexes([
  { on: ['wallet_id'] },
  { on: ['type'] },
  { on: ['reference_id'] },
]);

export default WalletTransaction;
