// pandamarket/backend/src/modules/pd-store/service.ts
// =============================================================================
// PandaMarket — Store Service
// Handles all store CRUD operations with tenant isolation
// =============================================================================

import { MedusaService } from '@medusajs/framework/utils';
import PdStore from './models/pd-store';

interface PdStoreRecord {
  id: string;
  subdomain?: string | null;
  custom_domain?: string | null;
}

interface PdStoreGeneratedMethods {
  listPdStores(args: {
    filters: Partial<Pick<PdStoreRecord, 'id' | 'subdomain' | 'custom_domain'>>;
  }): Promise<PdStoreRecord[]>;
}

function generated(service: PdStoreService): PdStoreGeneratedMethods {
  return service as unknown as PdStoreGeneratedMethods;
}

class PdStoreService extends MedusaService({
  PdStore,
}) {
  // MedusaService auto-generates: list, retrieve, create, update, delete
  // Custom business logic methods below:

  /**
   * Find a store by subdomain (for multi-tenant routing)
   */
  async findBySubdomain(subdomain: string): Promise<PdStoreRecord | null> {
    const [store] = await generated(this).listPdStores({
      filters: { subdomain },
    });
    return store || null;
  }

  /**
   * Find a store by custom domain (for multi-tenant routing)
   */
  async findByCustomDomain(domain: string): Promise<PdStoreRecord | null> {
    const [store] = await generated(this).listPdStores({
      filters: { custom_domain: domain },
    });
    return store || null;
  }

  /**
   * Resolve a hostname to a store_id.
   * Used by the Next.js middleware for tenant detection.
   */
  async resolveHostname(hostname: string): Promise<string | null> {
    // Try subdomain first (e.g., boutique1.pandamarket.tn)
    const hubDomain = process.env.PD_HUB_DOMAIN || 'pandamarket.tn';
    if (hostname.endsWith(`.${hubDomain}`)) {
      const subdomain = hostname.replace(`.${hubDomain}`, '');
      const store = await this.findBySubdomain(subdomain);
      return store?.id || null;
    }

    // Try custom domain
    const store = await this.findByCustomDomain(hostname);
    return store?.id || null;
  }

  /**
   * Check if a subdomain is available
   */
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const store = await this.findBySubdomain(subdomain);
    return !store;
  }
}

export default PdStoreService;
