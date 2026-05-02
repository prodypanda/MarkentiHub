// pandamarket/backend/src/modules/pd-verification/models/verification-document.ts
import { model } from '@medusajs/framework/utils';

const VerificationDocument = model.define('pd_verification_document', {
  id: model.id().primaryKey(),
  store_id: model.text(),
  rc_document_url: model.text(),
  cin_document_url: model.text(),
  phone_number: model.text(),
  phone_verified: model.boolean().default(false),
  status: model.enum(['pending', 'approved', 'rejected']).default('pending'),
  rejection_reason: model.text().nullable(),
  reviewed_by: model.text().nullable(),
  reviewed_at: model.dateTime().nullable(),
  submitted_at: model.dateTime(),
})
.indexes([
  { on: ['store_id'] },
  { on: ['status'] },
]);

export default VerificationDocument;
