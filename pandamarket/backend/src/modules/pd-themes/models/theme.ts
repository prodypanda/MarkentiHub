// pandamarket/backend/src/modules/pd-themes/models/theme.ts
import { model } from '@medusajs/framework/utils';

const Theme = model.define('pd_theme', {
  id: model.id().primaryKey(),
  slug: model.text().unique(),
  name: model.text(),
  description: model.text().nullable(),
  preview_url: model.text().nullable(),
  thumbnail_url: model.text().nullable(),
  is_free: model.boolean().default(true),
  price: model.float().default(0),
  is_active: model.boolean().default(true),
  category: model.text().default('general'),
  features: model.json().default({}),
})
.indexes([
  { on: ['slug'], unique: true },
  { on: ['is_active'] },
  { on: ['is_free'] },
]);

export default Theme;
