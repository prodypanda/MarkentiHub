// pandamarket/backend/src/api/routes/pd/admin/mandat/approve/route.ts
// =============================================================================
// PandaMarket — Deprecated
// This legacy endpoint has been superseded by:
//   PUT /api/pd/admin/mandats/:id   { status: 'approved' | 'rejected', ... }
// It is kept as a 410 Gone stub to surface clear guidance to older clients.
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandat/approve/route.ts
=======
import { requireAdminContext } from '../../../../../middlewares/auth-context';
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandat/approve/route.ts

export const POST = async (
  _req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/admin/mandat/approve/route.ts
=======
  requireAdminContext(req);
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/admin/mandat/approve/route.ts
  res.status(410).json({
    error: {
      code: 'PD_ENDPOINT_REMOVED',
      message: 'Utilisez PUT /api/pd/admin/mandats/:id à la place',
      details: {
        replacement: 'PUT /api/pd/admin/mandats/:id',
        body_example: { status: 'approved' },
      },
    },
  });
};
