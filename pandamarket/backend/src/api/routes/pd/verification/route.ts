// @ts-nocheck
// pandamarket/backend/src/api/routes/pd/verification/route.ts
// =============================================================================
// PandaMarket — KYC Verification Routes
// POST /api/pd/verification/documents  → Submit KYC docs
// GET  /api/pd/verification/status     → Check verification status
// GET  /api/pd/verification/upload-url → Get presigned upload URL for docs
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PdForbiddenError } from '../../../../utils/errors';
import { getKycUploadUrl } from '../../../../utils/s3';
import { FILE_CONSTRAINTS } from '../../../../utils/constants';

/**
 * GET /api/pd/verification/status
 * Get the current KYC verification status for the authenticated vendor
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const storeId = (req as Record<string, unknown>).pd_store_id as string;
  if (!storeId) throw new PdForbiddenError();

  const pdVerificationService = req.scope.resolve('pdVerificationService');
  const latest = await pdVerificationService.getLatestSubmission(storeId);

  const pdStoreService = req.scope.resolve('pdStoreService');
  const [store] = await pdStoreService.listPdStores({ filters: { id: storeId } });

  res.json({
    verification: {
      is_verified: store?.is_verified || false,
      store_status: store?.status || 'unverified',
      latest_submission: latest
        ? {
            id: latest.id,
            status: latest.status,
            submitted_at: latest.submitted_at,
            rejection_reason: latest.rejection_reason,
            reviewed_at: latest.reviewed_at,
          }
        : null,
    },
  });
}

/**
 * POST /api/pd/verification/documents
 * Submit KYC documents for review
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const storeId = (req as Record<string, unknown>).pd_store_id as string;
  if (!storeId) throw new PdForbiddenError();

  const body = (req as Record<string, unknown>).validatedBody as {
    rc_document_key: string;
    cin_document_key: string;
    phone_number: string;
  };

  const pdStoreService = req.scope.resolve('pdStoreService');
  const [store] = await pdStoreService.listPdStores({ filters: { id: storeId } });

  const pdVerificationService = req.scope.resolve('pdVerificationService');
  const doc = await pdVerificationService.submitDocuments({
    storeId,
    rcDocumentUrl: body.rc_document_key,
    cinDocumentUrl: body.cin_document_key,
    phoneNumber: body.phone_number,
    isAlreadyVerified: store?.is_verified || false,
  });

  res.status(201).json({
    verification: {
      id: doc.id,
      status: doc.status,
      submitted_at: doc.submitted_at,
      message: 'Documents soumis avec succès. Vous serez notifié de la décision.',
    },
  });
}
