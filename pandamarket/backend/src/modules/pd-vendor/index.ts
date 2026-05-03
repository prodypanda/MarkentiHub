import { Module } from '@medusajs/framework/utils';
import PdVendorService from './service';

export const PD_VENDOR_MODULE = 'pdVendorService';

export default Module(PD_VENDOR_MODULE, {
  service: PdVendorService,
});
