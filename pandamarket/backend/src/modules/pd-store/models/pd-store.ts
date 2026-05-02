// pandamarket/backend/src/modules/pd-store/models/pd-store.ts
// =============================================================================
// PandaMarket — Extended Store Model
// Extends MedusaJS Store with marketplace-specific fields
// =============================================================================

import { model } from '@medusajs/framework/utils';

const PdStore = model.define('pd_store', {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  status: model.enum(['unverified', 'verified', 'suspended']).default('unverified'),
  is_verified: model.boolean().default(false),
  subscription_plan: model
    .enum(['free', 'starter', 'regular', 'agency', 'pro', 'golden', 'platinum'])
    .default('free'),
  subscription_type: model.enum(['commission', 'yearly']).default('commission'),
  subscription_expires_at: model.dateTime().nullable(),
  subdomain: model.text().unique(),
  custom_domain: model.text().nullable(),
  theme_id: model.text().default('minimal'),
  settings: model.json().default({}),
  payment_config: model.json().nullable(),
  shipping_mode: model.enum(['self_managed', 'platform_unified']).default('self_managed'),
  category: model.text().nullable(),
  logo_url: model.text().nullable(),
  favicon_url: model.text().nullable(),
  owner_id: model.text(),
})
.indexes([
  { on: ['subdomain'], unique: true },
  { on: ['custom_domain'], unique: true, where: 'custom_domain IS NOT NULL' },
  { on: ['status'] },
  { on: ['owner_id'] },
  { on: ['subscription_plan'] },
]);

export default PdStore;
