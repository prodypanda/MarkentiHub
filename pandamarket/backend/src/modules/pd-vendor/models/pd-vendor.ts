import { model } from '@medusajs/framework/utils';

const PdVendor = model.define('pd_vendor', {
  id: model.id().primaryKey(),
  email: model.text(),
  password_hash: model.text(),
  first_name: model.text().nullable(),
  last_name: model.text().nullable(),
  role: model.enum(['vendor', 'admin', 'super_admin']).default('vendor'),
  is_active: model.boolean().default(true),
})
.indexes([
  { on: ['email'], unique: true },
  { on: ['role'] },
]);

export default PdVendor;
