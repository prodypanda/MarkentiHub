// pandamarket/backend/src/modules/pd-subscription/index.ts
import PdSubscriptionService from './service';
import { Module } from '@medusajs/framework/utils';

export const PD_SUBSCRIPTION_MODULE = 'pdSubscriptionService';

export default Module(PD_SUBSCRIPTION_MODULE, {
  service: PdSubscriptionService,
});
