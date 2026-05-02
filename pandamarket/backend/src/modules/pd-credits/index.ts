// pandamarket/backend/src/modules/pd-credits/index.ts
import PdCreditService from './service';
import { Module } from '@medusajs/framework/utils';

export const PD_CREDITS_MODULE = 'pdCreditService';

export default Module(PD_CREDITS_MODULE, {
  service: PdCreditService,
});
