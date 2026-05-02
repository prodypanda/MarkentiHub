// pandamarket/backend/src/modules/pd-themes/service.ts
import { MedusaService } from '@medusajs/framework/utils';
import Theme from './models/theme';

class PdThemeService extends MedusaService({ Theme }) {
  /**
   * Get all active themes
   */
  async getActiveThemes() {
    return this.listThemes({
      filters: { is_active: true },
      order: { is_free: 'DESC', name: 'ASC' },
    });
  }

  /**
   * Get free themes only
   */
  async getFreeThemes() {
    return this.listThemes({
      filters: { is_active: true, is_free: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Get a theme by slug
   */
  async getBySlug(slug: string) {
    const [theme] = await this.listThemes({
      filters: { slug },
    });
    return theme || null;
  }
}

export default PdThemeService;
