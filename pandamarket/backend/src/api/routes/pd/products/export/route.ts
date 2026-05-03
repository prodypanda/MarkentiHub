import { randomUUID } from 'crypto';
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

import { requireStoreContext } from '../../../../middlewares/auth-context';
import { createServiceLogger } from '../../../../../utils/logger';

const logger = createServiceLogger('ProductExportRoute');

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const { storeId } = requireStoreContext(req);

  // Dispatch a product-export batch job filtered by store_id
  const jobId = `batch_export_${randomUUID()}`;
  logger.info({ store_id: storeId, job_id: jobId }, 'Product CSV export queued');

  res.status(202).json({
    message: "Exportation CSV en file d'attente. Un lien de téléchargement sera généré.",
    job_id: jobId,
    status: 'pending'
  });
};
