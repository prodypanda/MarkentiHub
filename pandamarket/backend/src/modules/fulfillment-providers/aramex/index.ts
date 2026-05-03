import { ModuleProvider, Modules } from '@medusajs/framework/utils';
import { AramexFulfillmentProvider } from './service';

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [AramexFulfillmentProvider],
});
