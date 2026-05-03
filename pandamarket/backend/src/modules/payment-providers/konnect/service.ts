// @ts-nocheck
import { AbstractPaymentProvider } from '@medusajs/framework/utils';
import { PaymentProviderError, PaymentProviderSessionResponse, ProviderWebhookPayload } from '@medusajs/framework/types';
import { decryptAES256 } from '../../../../utils/crypto';

export class KonnectPaymentProvider extends AbstractPaymentProvider<any> {
  static identifier = 'pd-konnect';

  constructor(container: any, options: any) {
    super(container, options);
  }

  private async createKonnectPayment(amount: number, orderId: string, isDirect: boolean, vendorKeys?: { api_key: string }) {
    const apiKey = isDirect && vendorKeys ? vendorKeys.api_key : process.env.KONNECT_API_KEY;
    
    // Call Konnect Init Payment API
    // https://api.konnect.network/api/v2/payments/init-payment
    try {
      const response = await fetch('https://api.konnect.network/api/v2/payments/init-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || '',
        },
        body: JSON.stringify({
          receiverWalletId: isDirect ? vendorKeys?.api_key : process.env.KONNECT_WALLET_ID, // Use real wallet ID mapping
          token: "TND",
          amount: amount * 1000, 
          type: "immediate",
          description: `PandaMarket Order ${orderId}`,
          acceptedPaymentMethods: ["bank_card", "e-DINAR"],
          successUrl: `${process.env.PD_STORE_CORS}/checkout/success?order_id=${orderId}`,
          failUrl: `${process.env.PD_STORE_CORS}/checkout/fail?order_id=${orderId}`,
          theme: "light"
        })
      });

      const data = await response.json();
      if (!data.payUrl) {
        throw new Error('Failed to generate Konnect payment');
      }

      return data;
    } catch (e) {
      console.error('Konnect Error', e);
      throw e;
    }
  }

  async initiatePayment(context: any): Promise<PaymentProviderSessionResponse> {
    const amount = context.amount;
    const orderId = context.resource_id || 'temp_' + Date.now();
    
    // Extract store ID from context metadata if available
    const storeId = context.cart?.metadata?.store_id || context.metadata?.store_id || context.session_data?.store_id;
    let isDirect = false;
    let vendorKeys = undefined;

    if (storeId) {
      try {
        const storeService: any = this.container_.resolve('pdStoreModuleService');
        const store = await storeService.retrieveStore(storeId);
        
        // Only Pro, Golden, and Platinum plans allow direct payments
        const allowedPlans = ['pro', 'golden', 'platinum'];
        
        if (allowedPlans.includes(store.subscription_plan) && store.payment_config?.konnect) {
          isDirect = true;
          // In Konnect's case, it might use api_key instead of public/secret pair
          vendorKeys = {
            api_key: store.payment_config.konnect.api_key_encrypted ? decryptAES256(store.payment_config.konnect.api_key_encrypted) : ''
          };
        }
      } catch (e) {
        console.error('Error resolving store payment config for Konnect, falling back to escrow', e);
      }
    }

    // Mocking the call since we might not have real keys during development
    let konnectSession = { payUrl: 'https://api.konnect.network/pay/mock', paymentRef: 'mock_ref' };
    
    if (process.env.KONNECT_API_KEY || isDirect) {
      konnectSession = await this.createKonnectPayment(amount, orderId, isDirect, vendorKeys);
    }

    return {
      session_data: {
        payment_id: konnectSession.paymentRef,
        link: konnectSession.payUrl,
        status: 'pending',
        is_direct: isDirect,
        store_id: storeId,
      },
    };
  }

  async authorizePayment(paymentSessionData: Record<string, unknown>, context: Record<string, unknown>): Promise<{ data: Record<string, unknown>; status: "authorized" | "error" | "requires_more" | "pending" | "canceled" }> {
    const paymentId = paymentSessionData.payment_id as string;
    const apiKey = process.env.KONNECT_API_KEY || '';

    try {
      const response = await fetch(`https://api.konnect.network/api/v2/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      });
      
      const data = await response.json();
      
      if (data.payment && data.payment.status === 'completed') {
        return {
          data: paymentSessionData,
          status: 'authorized', 
        };
      } else {
        return {
          data: paymentSessionData,
          status: 'error',
        };
      }
    } catch (e) {
      console.error('Konnect verification error', e);
      return {
        data: paymentSessionData,
        status: 'error',
      };
    }
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
      status: 'captured',
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
    const data = payload.data as any;
    
    // Validate the incoming Konnect payload
    if (data.status === 'completed') {
      return {
        action: 'authorized',
        data: data,
      };
    }

    return {
      action: 'failed',
      data: data,
    };
  }
}
