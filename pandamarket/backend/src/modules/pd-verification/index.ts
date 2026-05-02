// pandamarket/backend/src/modules/pd-verification/index.ts
import PdVerificationService from './service';
import { Module } from '@medusajs/framework/utils';

export const PD_VERIFICATION_MODULE = 'pdVerificationService';

export default Module(PD_VERIFICATION_MODULE, {
  service: PdVerificationService,
});
