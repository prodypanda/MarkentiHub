// pandamarket/backend/src/modules/pd-wallet/index.ts
import PdWalletService from './service';
import { Module } from '@medusajs/framework/utils';

export const PD_WALLET_MODULE = 'pdWalletService';

export default Module(PD_WALLET_MODULE, {
  service: PdWalletService,
});
