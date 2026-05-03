import { MedusaService } from '@medusajs/framework/utils';
import PdVendor from './models/pd-vendor';

class PdVendorService extends MedusaService({
  PdVendor,
}) {
  async findByEmail(email: string) {
    const [vendor] = await this.listPdVendors({
      filters: { email: email.toLowerCase() },
    });
    return vendor || null;
  }
}

export default PdVendorService;
