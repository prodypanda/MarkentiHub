// pandamarket/backend/src/modules/pd-api-keys/models/api-key.ts
import { model } from '@medusajs/framework/utils';

const ApiKey = model.define('pd_api_key', {
  id: model.id().primaryKey(),
  store_id: model.text(),
  label: model.text(),
  key_hash: model.text(),
  key_prefix: model.text(),
  scopes: model.json().default({}),
  is_active: model.boolean().default(true),
  last_used_at: model.dateTime().nullable(),
  expires_at: model.dateTime().nullable(),
})
.indexes([
  { on: ['store_id'] },
  { on: ['key_hash'], unique: true },
  { on: ['is_active'] },
]);

export default ApiKey;
