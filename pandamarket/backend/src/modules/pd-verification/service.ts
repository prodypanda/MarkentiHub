// @ts-nocheck
// pandamarket/backend/src/modules/pd-verification/service.ts
import { MedusaService } from '@medusajs/framework/utils';
import VerificationDocument from './models/verification-document';
import {
  PdKycAlreadySubmittedError,
  PdKycAlreadyVerifiedError,
  PdNotFoundError,
  PdValidationError,
} from '../../utils/errors';
import { VerificationStatus } from '../../utils/constants';
import { createServiceLogger, logSecurityEvent } from '../../utils/logger';

const logger = createServiceLogger('KycService');

class PdVerificationService extends MedusaService({
  VerificationDocument,
}) {
  /**
   * Submit KYC documents for verification.
   * Throws if documents already submitted and pending.
   */
  async submitDocuments(params: {
    storeId: string;
    rcDocumentUrl: string;
    cinDocumentUrl: string;
    phoneNumber: string;
    isAlreadyVerified: boolean;
  }) {
    if (params.isAlreadyVerified) {
      throw new PdKycAlreadyVerifiedError();
    }

    // Check for existing pending submission
    const existing = await this.getLatestSubmission(params.storeId);
    if (existing && existing.status === VerificationStatus.Pending) {
      throw new PdKycAlreadySubmittedError(existing.submitted_at);
    }

    const doc = await this.createVerificationDocuments({
      store_id: params.storeId,
      rc_document_url: params.rcDocumentUrl,
      cin_document_url: params.cinDocumentUrl,
      phone_number: params.phoneNumber,
      phone_verified: false,
      status: VerificationStatus.Pending,
      submitted_at: new Date().toISOString(),
    });

    logSecurityEvent('kyc.submitted', { store_id: params.storeId, doc_id: doc.id });
    return doc;
  }

  /**
   * Admin approves a KYC submission.
   * Returns the updated document — caller must also update the Store.is_verified flag.
   */
  async approveVerification(docId: string, adminId: string) {
    const doc = await this.retrieveVerificationDocument(docId);

    if (!doc) {
      throw new PdNotFoundError('Verification document');
    }

    if (doc.status !== VerificationStatus.Pending) {
      throw new PdValidationError('Ce document a déjà été traité');
    }

    const updated = await this.updateVerificationDocuments({
      id: docId,
      status: VerificationStatus.Approved,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    });

    logSecurityEvent('kyc.approved', {
      store_id: doc.store_id,
      doc_id: docId,
      admin_id: adminId,
    });

    return updated;
  }

  /**
   * Admin rejects a KYC submission with a reason.
   */
  async rejectVerification(docId: string, adminId: string, reason: string) {
    const doc = await this.retrieveVerificationDocument(docId);

    if (!doc) {
      throw new PdNotFoundError('Verification document');
    }

    if (doc.status !== VerificationStatus.Pending) {
      throw new PdValidationError('Ce document a déjà été traité');
    }

    const updated = await this.updateVerificationDocuments({
      id: docId,
      status: VerificationStatus.Rejected,
      rejection_reason: reason,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    });

    logSecurityEvent('kyc.rejected', {
      store_id: doc.store_id,
      doc_id: docId,
      admin_id: adminId,
      reason,
    });

    return updated;
  }

  /**
   * Get the latest KYC submission for a store
   */
  async getLatestSubmission(storeId: string) {
    const [doc] = await this.listVerificationDocuments({
      filters: { store_id: storeId },
      order: { submitted_at: 'DESC' },
      take: 1,
    });

    return doc || null;
  }

  /**
   * Get all pending KYC documents (admin queue)
   */
  async getPendingQueue(page: number = 1, limit: number = 20) {
    return this.listVerificationDocuments({
      filters: { status: VerificationStatus.Pending },
      order: { submitted_at: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  /**
   * Retrieve a single verification document by ID
   */
  private async retrieveVerificationDocument(id: string) {
    const [doc] = await this.listVerificationDocuments({
      filters: { id },
    });
    return doc || null;
  }
}

export default PdVerificationService;
