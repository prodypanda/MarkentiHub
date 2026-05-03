// pandamarket/backend/src/api/routes/pd/admin/mandat/approve/route.ts
// =============================================================================
// PandaMarket — Deprecated
// This legacy endpoint has been superseded by:
//   PUT /api/pd/admin/mandats/:id   { status: 'approved' | 'rejected', ... }
// It is kept as a 410 Gone stub to surface clear guidance to older clients.
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export const POST = async (
  _req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
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
