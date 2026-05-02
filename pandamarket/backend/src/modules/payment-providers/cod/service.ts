// @ts-nocheck
import { AbstractPaymentProvider } from '@medusajs/framework/utils';
import { PaymentProviderError, PaymentProviderSessionResponse, ProviderWebhookPayload } from '@medusajs/framework/types';

export class CodPaymentProvider extends AbstractPaymentProvider<any> {
  static identifier = 'pd-cod';

  constructor(container: any, options: any) {
    super(container, options);
  }

  async initiatePayment(context: any): Promise<PaymentProviderSessionResponse> {
    return {
      session_data: {
        status: 'pending',
      },
    };
  }

  async authorizePayment(paymentSessionData: Record<string, unknown>, context: Record<string, unknown>): Promise<{ data: Record<string, unknown>; status: "authorized" | "error" | "requires_more" | "pending" | "canceled" }> {
    return {
      data: paymentSessionData,
      status: 'authorized', // COD is authorized immediately
    };
  }

  async cancelPayment(paymentSessionData: Record<string, unknown>): Promise<Record<string, unknown> | PaymentProviderError> {
    return {
      ...paymentSessionData,
      status: 'canceled',
    };
  }

  async capturePayment(paymentSessionData: Record<string, unknown>): Promise<Record<string, unknown> | PaymentProviderError> {
    return {
      ...paymentSessionData,
      status: 'captured', // Happens when delivered
    };
  }

  async deletePayment(paymentSessionData: Record<string, unknown>): Promise<Record<string, unknown> | PaymentProviderError> {
    return paymentSessionData;
  }

  async getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<"authorized" | "error" | "requires_more" | "pending" | "canceled" | "captured"> {
    return paymentSessionData.status as any || 'pending';
  }

  async refundPayment(paymentSessionData: Record<string, unknown>, refundAmount: number): Promise<Record<string, unknown> | PaymentProviderError> {
    return paymentSessionData;
  }

  async updatePayment(context: any): Promise<PaymentProviderSessionResponse> {
    return {
      session_data: context.session_data,
    };
  }

  async getWebhookActionAndData(payload: ProviderWebhookPayload): Promise<{ action: "successful" | "failed" | "authorized" | "captured" | "not_supported"; data: Record<string, unknown> }> {
    return {
      action: 'not_supported',
      data: payload.data.payload as Record<string, unknown>,
    };
  }
}
