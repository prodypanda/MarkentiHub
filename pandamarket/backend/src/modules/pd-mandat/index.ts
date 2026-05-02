// pandamarket/backend/src/modules/pd-mandat/index.ts
import PdMandatService from './service';
import { Module } from '@medusajs/framework/utils';

export const PD_MANDAT_MODULE = 'pdMandatService';

export default Module(PD_MANDAT_MODULE, {
  service: PdMandatService,
});
