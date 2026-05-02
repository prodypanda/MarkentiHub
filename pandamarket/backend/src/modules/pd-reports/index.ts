// pandamarket/backend/src/modules/pd-reports/index.ts
import PdReportService from './service';
import { Module } from '@medusajs/framework/utils';

export const PD_REPORTS_MODULE = 'pdReportService';

export default Module(PD_REPORTS_MODULE, {
  service: PdReportService,
});
