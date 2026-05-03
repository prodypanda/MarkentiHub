import { AbstractPaymentProvider } from '@medusajs/framework/utils';
import type {
  PaymentProviderError,
  PaymentProviderSessionResponse,
  ProviderWebhookPayload,
} from '@medusajs/framework/types';

type ProviderStatus =
  | 'authorized'
  | 'error'
  | 'requires_more'
  | 'pending'
  | 'canceled'
  | 'captured';

interface PaymentContextShape {
  session_data?: Record<string, unknown> | null;
}

const providerStatuses = new Set<ProviderStatus>([
  'authorized',
  'error',
  'requires_more',
  'pending',
  'canceled',
  'captured',
]);

function normalizeStatus(status: unknown): ProviderStatus {
  return typeof status === 'string' && providerStatuses.has(status as ProviderStatus)
    ? (status as ProviderStatus)
    : 'pending';
}

function webhookData(payload: ProviderWebhookPayload): Record<string, unknown> {
  const data = (payload.data as { payload?: unknown } | undefined)?.payload;
  return data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
}

export class MandatPaymentProvider extends AbstractPaymentProvider<Record<string, unknown>> {
  static identifier = 'pd-mandat';

  constructor(container: Record<string, unknown>, options: Record<string, unknown>) {
    super(container, options);
  }

  async initiatePayment(_context: PaymentContextShape): Promise<PaymentProviderSessionResponse> {
    return {
      session_data: {
        status: 'pending',
        proof_url: null, // Vendor will upload proof image here later
      },
    };
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    _context: Record<string, unknown>,
  ): Promise<{ data: Record<string, unknown>; status: ProviderStatus }> {
    // Mandat is NOT authorized until admin validates the proof
    return {
      data: paymentSessionData,
      status: 'pending', 
    };
  }

  async cancelPayment(paymentSessionData: Record<string, unknown>): Promise<Record<string, unknown> | PaymentProviderError> {
    return {
      ...paymentSessionData,
      status: 'canceled',
    };
  }

  async capturePayment(paymentSessionData: Record<string, unknown>): Promise<Record<string, unknown> | PaymentProviderError> {
    // Only capture when admin approves
    return {
      ...paymentSessionData,
      status: 'captured',
    };
  }

  async deletePayment(paymentSessionData: Record<string, unknown>): Promise<Record<string, unknown> | PaymentProviderError> {
    return paymentSessionData;
  }

  async getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<ProviderStatus> {
    return normalizeStatus(paymentSessionData.status);
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    _refundAmount: number,
  ): Promise<Record<string, unknown> | PaymentProviderError> {
    return paymentSessionData;
  }

  async updatePayment(context: PaymentContextShape): Promise<PaymentProviderSessionResponse> {
    return {
      session_data: context.session_data ?? {},
    };
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload,
  ): Promise<{
    action: 'successful' | 'failed' | 'authorized' | 'captured' | 'not_supported';
    data: Record<string, unknown>;
  }> {
    return {
      action: 'not_supported',
      data: webhookData(payload),
    };
  }
}
