// pandamarket/backend/src/modules/pd-reports/models/report.ts
import { model } from '@medusajs/framework/utils';

const Report = model.define('pd_report', {
  id: model.id().primaryKey(),
  reporter_id: model.text(),
  store_id: model.text(),
  order_id: model.text().nullable(),
  reason: model.text(),
  status: model.enum(['open', 'investigating', 'resolved', 'dismissed']).default('open'),
  admin_notes: model.text().nullable(),
  resolved_by: model.text().nullable(),
  resolved_at: model.dateTime().nullable(),
})
.indexes([
  { on: ['store_id'] },
  { on: ['reporter_id'] },
  { on: ['status'] },
]);

export default Report;
