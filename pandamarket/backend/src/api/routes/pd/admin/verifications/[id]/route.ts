// @ts-nocheck
// pandamarket/backend/src/api/routes/pd/admin/verifications/[id]/route.ts
// =============================================================================
// Approve or Reject a KYC submission
// PUT /api/pd/admin/verifications/:id
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PD_EVENTS } from '../../../../../../utils/constants';

/**
 * PUT /api/pd/admin/verifications/:id
 * Approve or reject a KYC verification document
 */
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const { id } = req.params;
  const adminId = (req as Record<string, unknown>).pd_user_id as string;
  const body = (req as Record<string, unknown>).validatedBody as {
    status: 'approved' | 'rejected';
    notes?: string;
  };

  const pdVerificationService = req.scope.resolve('pdVerificationService');

  let doc;
  if (body.status === 'approved') {
    doc = await pdVerificationService.approveVerification(id, adminId);

    // Update the store's verified status
    const pdStoreService = req.scope.resolve('pdStoreService');
    await pdStoreService.updatePdStores({
      id: doc.store_id,
      status: 'verified',
      is_verified: true,
    });
  } else {
    doc = await pdVerificationService.rejectVerification(
      id,
      adminId,
      body.notes || 'Documents refusés',
    );
  }

  res.json({
    verification: doc,
    message:
      body.status === 'approved'
        ? 'Vendeur vérifié avec succès'
        : 'Vérification refusée',
  });
}
