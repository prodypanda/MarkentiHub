// pandamarket/backend/src/modules/pd-reports/service.ts
import { MedusaService } from '@medusajs/framework/utils';
import Report from './models/report';
import { PdConflictError, PdNotFoundError } from '../../utils/errors';
import { ReportStatus } from '../../utils/constants';

interface ReportRecord {
  id: string;
  reporter_id: string;
  store_id: string;
  order_id?: string | null;
  reason: string;
  status: ReportStatus;
  admin_notes?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | Date | null;
}

interface ReportCreateInput {
  reporter_id: string;
  store_id: string;
  order_id: string | null;
  reason: string;
  status: ReportStatus.Open;
}

interface ReportUpdateInput {
  id: string;
  status: ReportStatus.Resolved | ReportStatus.Dismissed;
  admin_notes: string;
  resolved_by: string;
  resolved_at: string;
}

interface ReportListArgs {
  filters: Partial<Pick<ReportRecord, 'id' | 'reporter_id' | 'store_id' | 'order_id' | 'status'>>;
  order?: { created_at: 'ASC' | 'DESC' };
  skip?: number;
  take?: number;
}

interface PdReportGeneratedMethods {
  createReports(input: ReportCreateInput): Promise<ReportRecord>;
  updateReports(input: ReportUpdateInput): Promise<ReportRecord>;
  listReports(args: ReportListArgs): Promise<ReportRecord[]>;
}

function generated(service: PdReportService): PdReportGeneratedMethods {
  return service as unknown as PdReportGeneratedMethods;
}

class PdReportService extends MedusaService({ Report }) {
  async createReport(params: {
    reporterId: string;
    storeId: string;
    orderId?: string;
    reason: string;
  }): Promise<ReportRecord> {
    // Prevent duplicate reports for the same order
    if (params.orderId) {
      const [existing] = await generated(this).listReports({
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

    return generated(this).createReports({
      reporter_id: params.reporterId,
      store_id: params.storeId,
      order_id: params.orderId || null,
      reason: params.reason,
      status: ReportStatus.Open,
    });
  }

  async resolveReport(
    reportId: string,
    adminId: string,
    notes: string,
    dismiss: boolean = false,
  ): Promise<ReportRecord> {
    const [report] = await generated(this).listReports({ filters: { id: reportId } });
    if (!report) throw new PdNotFoundError('Report');

    return generated(this).updateReports({
      id: reportId,
      status: dismiss ? ReportStatus.Dismissed : ReportStatus.Resolved,
      admin_notes: notes,
      resolved_by: adminId,
      resolved_at: new Date().toISOString(),
    });
  }

  async getOpenReports(page: number = 1, limit: number = 20): Promise<ReportRecord[]> {
    return generated(this).listReports({
      filters: { status: ReportStatus.Open },
      order: { created_at: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}

export default PdReportService;
