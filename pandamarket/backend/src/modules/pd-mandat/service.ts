// @ts-nocheck
// pandamarket/backend/src/modules/pd-mandat/service.ts
import { MedusaService } from '@medusajs/framework/utils';
import MandatProof from './models/mandat-proof';
import { PdConflictError, PdNotFoundError, PdValidationError } from '../../utils/errors';
import { MandatProofStatus } from '../../utils/constants';
import { logSecurityEvent, logPaymentEvent } from '../../utils/logger';

class PdMandatService extends MedusaService({ MandatProof }) {
  /**
   * Upload a Mandat Minute proof
   */
  async uploadProof(params: {
    orderId: string;
    storeId: string;
    imageUrl: string;
    amountExpected: number;
    uploadedBy: 'buyer' | 'vendor';
  }) {
    // Check if there's already an approved proof for this order
    const [existing] = await this.listMandatProofs({
      filters: { order_id: params.orderId, status: MandatProofStatus.Approved },
    });
    if (existing) {
      throw new PdConflictError(
        'PD_PAY_MANDAT_ALREADY_REVIEWED',
        'Ce mandat a déjà été traité',
        { proof_id: existing.id, status: existing.status },
      );
    }

    const proof = await this.createMandatProofs({
      order_id: params.orderId,
      store_id: params.storeId,
      image_url: params.imageUrl,
      amount_expected: params.amountExpected,
      uploaded_by: params.uploadedBy,
      status: MandatProofStatus.Pending,
    });

    logPaymentEvent('mandat.uploaded', {
      proof_id: proof.id,
      order_id: params.orderId,
      amount: params.amountExpected,
    });

    return proof;
  }

  /**
   * Admin approves a mandat proof — triggers payment.captured
   */
  async approveProof(proofId: string, adminId: string) {
    const proof = await this.getProofById(proofId);

    if (proof.status !== MandatProofStatus.Pending) {
      throw new PdConflictError(
        'PD_PAY_MANDAT_ALREADY_REVIEWED',
        'Ce mandat a déjà été traité',
        { proof_id: proofId, status: proof.status },
      );
    }

    const updated = await this.updateMandatProofs({
      id: proofId,
      status: MandatProofStatus.Approved,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    });

    logSecurityEvent('mandat.approved', {
      proof_id: proofId,
      order_id: proof.order_id,
      admin_id: adminId,
    });

    return updated;
  }

  /**
   * Admin rejects a mandat proof — buyer can re-upload
   */
  async rejectProof(proofId: string, adminId: string, reason: string) {
    const proof = await this.getProofById(proofId);

    if (proof.status !== MandatProofStatus.Pending) {
      throw new PdConflictError(
        'PD_PAY_MANDAT_ALREADY_REVIEWED',
        'Ce mandat a déjà été traité',
        { proof_id: proofId, status: proof.status },
      );
    }

    const updated = await this.updateMandatProofs({
      id: proofId,
      status: MandatProofStatus.Rejected,
      rejection_reason: reason,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    });

    logSecurityEvent('mandat.rejected', {
      proof_id: proofId,
      order_id: proof.order_id,
      admin_id: adminId,
      reason,
    });

    return updated;
  }

  /**
   * Get pending mandat proofs (admin queue)
   */
  async getPendingQueue(page: number = 1, limit: number = 20) {
    return this.listMandatProofs({
      filters: { status: MandatProofStatus.Pending },
      order: { created_at: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  private async getProofById(proofId: string) {
    const [proof] = await this.listMandatProofs({ filters: { id: proofId } });
    if (!proof) throw new PdNotFoundError('Mandat proof');
    return proof;
  }
}

export default PdMandatService;
