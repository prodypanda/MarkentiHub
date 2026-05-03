// pandamarket/backend/src/api/routes/pd/verification/route.ts
// =============================================================================
// PandaMarket — KYC Verification Routes
// POST /api/pd/verification/documents  → Submit KYC docs
// GET  /api/pd/verification/status     → Check verification status
// GET  /api/pd/verification/upload-url → Get presigned upload URL for docs
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';

import { requireStoreContext } from '../../../middlewares/auth-context';
import { PdValidationError } from '../../../../utils/errors';
import { getKycUploadUrl } from '../../../../utils/s3';
import { FILE_CONSTRAINTS } from '../../../../utils/constants';

const allowedKycTypes = [...FILE_CONSTRAINTS.ALLOWED_KYC_TYPES] as [string, ...string[]];

const uploadUrlQuerySchema = z.object({
  action: z.literal('upload-url'),
  document_type: z.enum(['rc', 'cin']),
  content_type: z.enum(allowedKycTypes),
});

const submitDocumentsSchema = z.object({
  rc_document_key: z.string().min(1),
  cin_document_key: z.string().min(1),
  phone_number: z.string().trim().min(8).max(32),
});

interface StoreLike {
  is_verified?: boolean | null;
  status?: string | null;
}

interface VerificationSubmissionLike {
  id: string;
  status: string;
  submitted_at?: string | Date | null;
  rejection_reason?: string | null;
  reviewed_at?: string | Date | null;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<StoreLike[]>;
}

interface IPdVerificationService {
  getLatestSubmission(storeId: string): Promise<VerificationSubmissionLike | null>;
  submitDocuments(params: {
    storeId: string;
    rcDocumentUrl: string;
    cinDocumentUrl: string;
    phoneNumber: string;
    isAlreadyVerified: boolean;
  }): Promise<VerificationSubmissionLike>;
}

function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }
  return typeof value === 'string' ? value : undefined;
}

function validationFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  error.issues.forEach((issue) => {
    fields[issue.path.join('.')] = issue.message;
  });
  return fields;
}

/**
 * GET /api/pd/verification/status
 * Get the current KYC verification status for the authenticated vendor
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const { storeId } = requireStoreContext(req);

  if (firstQueryValue(req.query.action) === 'upload-url') {
    const parsed = uploadUrlQuerySchema.safeParse({
      action: firstQueryValue(req.query.action),
      document_type: firstQueryValue(req.query.document_type),
      content_type: firstQueryValue(req.query.content_type),
    });
    if (!parsed.success) {
      throw new PdValidationError('Données invalides', {
        fields: validationFields(parsed.error),
      });
    }

    const { uploadUrl, key } = await getKycUploadUrl(
      storeId,
      parsed.data.document_type,
      parsed.data.content_type,
    );

    res.json({
      upload_url: uploadUrl,
      key,
      expires_in: FILE_CONSTRAINTS.PRESIGNED_URL_EXPIRY_UPLOAD,
    });
    return;
  }

  const pdVerificationService = req.scope.resolve<IPdVerificationService>('pdVerificationService');
  const latest = await pdVerificationService.getLatestSubmission(storeId);

  const pdStoreService = req.scope.resolve<IPdStoreService>('pdStoreService');
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
  const { storeId } = requireStoreContext(req);

  const parsed = submitDocumentsSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }
  const body = parsed.data;

  const pdStoreService = req.scope.resolve<IPdStoreService>('pdStoreService');
  const [store] = await pdStoreService.listPdStores({ filters: { id: storeId } });

  const pdVerificationService = req.scope.resolve<IPdVerificationService>('pdVerificationService');
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
