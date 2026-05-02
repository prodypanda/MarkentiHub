// pandamarket/backend/src/modules/pd-subscription/models/subscription-limits.ts
import { model } from '@medusajs/framework/utils';

const SubscriptionLimits = model.define('pd_subscription_limits', {
  id: model.id().primaryKey(),
  plan: model
    .enum(['free', 'starter', 'regular', 'agency', 'pro', 'golden', 'platinum'])
    .unique(),
  max_products: model.number().default(10),
  max_images_per_product: model.number().default(2),
  commission_rate: model.float().default(0.15),
  has_custom_domain: model.boolean().default(false),
  has_page_builder: model.boolean().default(false),
  has_ai_seo: model.boolean().default(false),
  has_image_compression: model.boolean().default(false),
  has_direct_payment: model.boolean().default(false),
  has_api_keys: model.boolean().default(false),
  has_white_label: model.boolean().default(false),
  ai_tokens_included: model.number().default(0),
  yearly_price: model.float().default(0),
});

export default SubscriptionLimits;
