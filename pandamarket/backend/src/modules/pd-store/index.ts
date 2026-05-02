// pandamarket/backend/src/modules/pd-store/index.ts
import PdStoreService from './service';
import { Module } from '@medusajs/framework/utils';

export const PD_STORE_MODULE = 'pdStoreService';

export default Module(PD_STORE_MODULE, {
  service: PdStoreService,
});
