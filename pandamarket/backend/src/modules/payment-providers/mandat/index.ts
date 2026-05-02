import { ModuleProvider, Modules } from '@medusajs/framework/utils';
import { MandatPaymentProvider } from './service';

export default ModuleProvider(Modules.PAYMENT, {
  services: [MandatPaymentProvider],
});
