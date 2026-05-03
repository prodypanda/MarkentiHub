// pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
// =============================================================================
// PandaMarket — Admin: Approve or Reject a Mandat Minute proof
// PUT /api/pd/admin/mandats/:id
// Body: { status: 'approved' | 'rejected', rejection_reason?: string }
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';

import { requireAdminContext } from '../../../../../middlewares/auth-context';
import { PdValidationError } from '../../../../../../utils/errors';

const bodySchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejection_reason: z.string().min(3).max(500).optional(),
});

interface MandatProof {
  id: string;
  status: string;
  order_id?: string;
}

interface IPdMandatService {
  approveProof(proofId: string, adminId: string): Promise<MandatProof>;
  rejectProof(proofId: string, adminId: string, reason: string): Promise<MandatProof>;
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

  if (parsed.data.status === 'rejected' && !parsed.data.rejection_reason) {
    throw new PdValidationError('Un motif de rejet est requis', {
      fields: { rejection_reason: 'Champ requis pour un rejet' },
    });
  }

  const pdMandatService = req.scope.resolve<IPdMandatService>('pdMandatService');
  const adminId = userId as string;

  const proof =
    parsed.data.status === 'approved'
      ? await pdMandatService.approveProof(id, adminId)
      : await pdMandatService.rejectProof(
          id,
          adminId,
          parsed.data.rejection_reason ?? 'Preuve de mandat rejetée',
        );

  res.json({
    mandat: proof,
    message:
      parsed.data.status === 'approved'
        ? 'Mandat approuvé — commande débloquée'
        : 'Mandat rejeté',
  });
}
