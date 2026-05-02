// pandamarket/backend/src/modules/pd-api-keys/index.ts
import PdApiKeyService from './service';
import { Module } from '@medusajs/framework/utils';

export const PD_API_KEYS_MODULE = 'pdApiKeyService';

export default Module(PD_API_KEYS_MODULE, {
  service: PdApiKeyService,
});
