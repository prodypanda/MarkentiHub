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

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
=======
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
const paramsSchema = z.object({
  id: z.string().trim().min(1).max(128),
});

function validationFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  error.issues.forEach((i) => {
    fields[i.path.join('.')] = i.message;
  });
  return fields;
}

function getProofId(req: MedusaRequest): string {
  const parsed = paramsSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }
  return parsed.data.id;
}

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
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
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
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

=======
  const id = getProofId(req);

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }

=======
  const id = getProofId(req);

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }

>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
  if (parsed.data.status === 'rejected' && !parsed.data.rejection_reason) {
    throw new PdValidationError('Un motif de rejet est requis', {
      fields: { rejection_reason: 'Champ requis pour un rejet' },
    });
  }

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandats/[id]/route.ts
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
