// pandamarket/backend/src/modules/pd-notifications/models/notification.ts
import { model } from '@medusajs/framework/utils';

const Notification = model.define('pd_notification', {
  id: model.id().primaryKey(),
  user_id: model.text(),
  type: model.text(),
  title: model.text(),
  message: model.text(),
  data: model.json().default({}),
  is_read: model.boolean().default(false),
})
.indexes([
  { on: ['user_id'] },
  { on: ['is_read'] },
  { on: ['type'] },
]);

export default Notification;
