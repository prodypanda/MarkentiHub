// pandamarket/backend/src/modules/pd-wallet/models/vendor-wallet.ts
import { model } from '@medusajs/framework/utils';

const VendorWallet = model.define('pd_vendor_wallet', {
  id: model.id().primaryKey(),
  store_id: model.text().unique(),
  balance: model.float().default(0),
  pending_balance: model.float().default(0),
  total_earned: model.float().default(0),
  total_commission_paid: model.float().default(0),
  total_withdrawn: model.float().default(0),
  payout_mode: model.enum(['automatic', 'on_demand']).default('on_demand'),
  retention_days: model.number().default(7),
  bank_name: model.text().nullable(),
  bank_rib: model.text().nullable(),
})
.indexes([
  { on: ['store_id'], unique: true },
]);

export default VendorWallet;
