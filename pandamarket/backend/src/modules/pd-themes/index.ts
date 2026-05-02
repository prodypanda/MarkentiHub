// pandamarket/backend/src/modules/pd-themes/index.ts
import PdThemeService from './service';
import { Module } from '@medusajs/framework/utils';

export const PD_THEMES_MODULE = 'pdThemeService';

export default Module(PD_THEMES_MODULE, {
  service: PdThemeService,
});
