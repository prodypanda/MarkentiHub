// pandamarket/backend/src/modules/pd-credits/models/vendor-credits.ts
import { model } from '@medusajs/framework/utils';

const VendorCredits = model.define('pd_vendor_credits', {
  id: model.id().primaryKey(),
  store_id: model.text().unique(),
  ai_tokens_balance: model.number().default(0),
  ai_tokens_used: model.number().default(0),
  ai_tokens_purchased: model.number().default(0),
  last_refill_at: model.dateTime().nullable(),
})
.indexes([
  { on: ['store_id'], unique: true },
]);

export default VendorCredits;
