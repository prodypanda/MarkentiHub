import { ModuleProvider, Modules } from '@medusajs/framework/utils';
import { FlouciPaymentProvider } from './service';

export default ModuleProvider(Modules.PAYMENT, {
  services: [FlouciPaymentProvider],
});
