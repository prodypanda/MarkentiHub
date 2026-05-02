// @ts-nocheck
// pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
// =============================================================================
// Approve or Reject a Mandat Minute proof
// PUT /api/pd/admin/mandats/:id
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

/**
 * PUT /api/pd/admin/mandats/:id
 * Approve or reject a Mandat Minute proof
 */
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const { id } = req.params;
  const adminId = (req as Record<string, unknown>).pd_user_id as string;
  const body = (req as Record<string, unknown>).validatedBody as {
    status: 'approved' | 'rejected';
    rejection_reason?: string;
  };

  const pdMandatService = req.scope.resolve('pdMandatService');

  let proof;
  if (body.status === 'approved') {
    proof = await pdMandatService.approveProof(id, adminId);
  } else {
    proof = await pdMandatService.rejectProof(
      id,
      adminId,
      body.rejection_reason || 'Preuve de mandat rejetée',
    );
  }

  res.json({
    mandat: proof,
    message:
      body.status === 'approved'
        ? 'Mandat approuvé — commande débloquée'
        : 'Mandat rejeté',
  });
}
