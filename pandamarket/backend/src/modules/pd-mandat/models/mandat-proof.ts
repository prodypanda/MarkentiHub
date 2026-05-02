// pandamarket/backend/src/modules/pd-mandat/models/mandat-proof.ts
import { model } from '@medusajs/framework/utils';

const MandatProof = model.define('pd_mandat_proof', {
  id: model.id().primaryKey(),
  order_id: model.text(),
  store_id: model.text(),
  image_url: model.text(),
  amount_expected: model.float(),
  uploaded_by: model.enum(['buyer', 'vendor']),
  status: model.enum(['pending', 'approved', 'rejected']).default('pending'),
  rejection_reason: model.text().nullable(),
  reviewed_by: model.text().nullable(),
  reviewed_at: model.dateTime().nullable(),
})
.indexes([
  { on: ['order_id'] },
  { on: ['store_id'] },
  { on: ['status'] },
]);

export default MandatProof;
