// pandamarket/backend/src/api/routes/pd/admin/verifications/[id]/route.ts
// =============================================================================
// PandaMarket — Admin: Approve or Reject a KYC submission
// PUT /api/pd/admin/verifications/:id
// Body: { status: 'approved' | 'rejected', notes?: string }
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';

import { requireAdminContext } from '../../../../../middlewares/auth-context';
import { PdValidationError } from '../../../../../../utils/errors';
import { StoreStatus } from '../../../../../../utils/constants';
import { createServiceLogger } from '../../../../../../utils/logger';

const logger = createServiceLogger('AdminVerificationRoute');

const bodySchema = z.object({
  status: z.enum(['approved', 'rejected']),
  notes: z.string().min(3).max(500).optional(),
});

interface VerificationDoc {
  id: string;
  store_id: string;
  status: string;
}

interface IPdVerificationService {
  approveVerification(docId: string, adminId: string): Promise<VerificationDoc>;
  rejectVerification(docId: string, adminId: string, reason: string): Promise<VerificationDoc>;
}

interface IPdStoreService {
  updatePdStores(args: { id: string; status?: StoreStatus; is_verified?: boolean }): Promise<unknown>;
}

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const { userId } = requireAdminContext(req);
  const { id } = req.params;

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    parsed.error.issues.forEach((i) => {
      fields[i.path.join('.')] = i.message;
    });
    throw new PdValidationError('Données invalides', { fields });
  }

  if (parsed.data.status === 'rejected' && !parsed.data.notes) {
    throw new PdValidationError('Un motif de rejet est requis', {
      fields: { notes: 'Champ requis pour un rejet' },
    });
  }

  const verificationService = req.scope.resolve<IPdVerificationService>('pdVerificationService');
  const storeService = req.scope.resolve<IPdStoreService>('pdStoreService');
  const adminId = userId as string;

  let doc: VerificationDoc;
  if (parsed.data.status === 'approved') {
    doc = await verificationService.approveVerification(id, adminId);
    await storeService.updatePdStores({
      id: doc.store_id,
      status: StoreStatus.Verified,
      is_verified: true,
    });
    logger.info({ store_id: doc.store_id, doc_id: id, admin_id: adminId }, 'KYC approved');
  } else {
    doc = await verificationService.rejectVerification(
      id,
      adminId,
      parsed.data.notes ?? 'Documents refusés',
    );
    logger.info({ store_id: doc.store_id, doc_id: id, admin_id: adminId }, 'KYC rejected');
  }

  res.json({
    verification: doc,
    message:
      parsed.data.status === 'approved'
        ? 'Vendeur vérifié avec succès'
        : 'Vérification refusée',
  });
}
