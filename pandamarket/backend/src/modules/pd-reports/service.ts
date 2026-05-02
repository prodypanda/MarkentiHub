// @ts-nocheck
// pandamarket/backend/src/modules/pd-reports/service.ts
import { MedusaService } from '@medusajs/framework/utils';
import Report from './models/report';
import { PdConflictError, PdNotFoundError } from '../../utils/errors';
import { ReportStatus } from '../../utils/constants';

class PdReportService extends MedusaService({ Report }) {
  async createReport(params: {
    reporterId: string;
    storeId: string;
    orderId?: string;
    reason: string;
  }) {
    // Prevent duplicate reports for the same order
    if (params.orderId) {
      const [existing] = await this.listReports({
        filters: {
          reporter_id: params.reporterId,
          store_id: params.storeId,
          order_id: params.orderId,
        },
      });
      if (existing) {
        throw new PdConflictError(
          'PD_REPORT_DUPLICATE',
          'Vous avez déjà signalé ce vendeur pour cette commande',
          { report_id: existing.id },
        );
      }
    }

    return this.createReports({
      reporter_id: params.reporterId,
      store_id: params.storeId,
      order_id: params.orderId || null,
      reason: params.reason,
      status: ReportStatus.Open,
    });
  }

  async resolveReport(reportId: string, adminId: string, notes: string, dismiss: boolean = false) {
    const [report] = await this.listReports({ filters: { id: reportId } });
    if (!report) throw new PdNotFoundError('Report');

    return this.updateReports({
      id: reportId,
      status: dismiss ? ReportStatus.Dismissed : ReportStatus.Resolved,
      admin_notes: notes,
      resolved_by: adminId,
      resolved_at: new Date().toISOString(),
    });
  }

  async getOpenReports(page: number = 1, limit: number = 20) {
    return this.listReports({
      filters: { status: ReportStatus.Open },
      order: { created_at: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}

export default PdReportService;
