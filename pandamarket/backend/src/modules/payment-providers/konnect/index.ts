import { ModuleProvider, Modules } from '@medusajs/framework/utils';
import { KonnectPaymentProvider } from './service';

export default ModuleProvider(Modules.PAYMENT, {
  services: [KonnectPaymentProvider],
});
