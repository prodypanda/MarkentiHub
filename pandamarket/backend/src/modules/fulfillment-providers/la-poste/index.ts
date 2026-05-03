import { ModuleProvider, Modules } from '@medusajs/framework/utils';
import { LaPosteFulfillmentProvider } from './service';

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [LaPosteFulfillmentProvider],
});
