// @ts-nocheck
import { AbstractPaymentProvider } from '@medusajs/framework/utils';
import { PaymentProviderError, PaymentProviderSessionResponse, ProviderWebhookPayload } from '@medusajs/framework/types';
import { encryptAES256, decryptAES256 } from '../../../../utils/crypto';

export class FlouciPaymentProvider extends AbstractPaymentProvider<any> {
  static identifier = 'pd-flouci';

  constructor(container: any, options: any) {
    super(container, options);
  }

  // Helper to call Flouci API
  private async createFlouciPayment(amount: number, orderId: string, isDirect: boolean, vendorKeys?: { public_key: string, secret_key: string }) {
    // In a real environment, we use process.env for central Escrow payments
    // If isDirect=true, we use the vendor's decrypted keys
    const appToken = isDirect && vendorKeys ? vendorKeys.public_key : process.env.FLOUCI_APP_TOKEN;
    const appSecret = isDirect && vendorKeys ? vendorKeys.secret_key : process.env.FLOUCI_APP_SECRET;
    
    // Call Flouci Generate Payment API
    // https://developers.flouci.com/api/payment/generate
    try {
      const response = await fetch('https://developers.flouci.com/api/generate_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          app_token: appToken,
          app_secret: appSecret,
          accept_card: "true",
          amount: amount * 1000, // Assuming millimes
          success_link: `${process.env.PD_STORE_CORS}/checkout/success?order_id=${orderId}`,
          fail_link: `${process.env.PD_STORE_CORS}/checkout/fail?order_id=${orderId}`,
          session_timeout_secs: 1200,
          developer_tracking_id: orderId
        })
      });

      const data = await response.json();
      if (!data.result) {
        throw new Error('Failed to generate Flouci payment');
      }

      return data.result;
    } catch (e) {
      console.error('Flouci Error', e);
      throw e;
    }
  }

  async initiatePayment(context: any): Promise<PaymentProviderSessionResponse> {
    const amount = context.amount; // Ensure it's passed down correctly
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
        
        if (allowedPlans.includes(store.subscription_plan) && store.payment_config?.flouci) {
          isDirect = true;
          // Decrypt the AES-256-GCM encrypted vendor keys stored in the database
          vendorKeys = {
            public_key: store.payment_config.flouci.public_key,
            secret_key: decryptAES256(store.payment_config.flouci.secret_key_encrypted)
          };
        }
      } catch (e) {
        console.error('Error resolving store payment config, falling back to escrow', e);
      }
    }

    const flouciSession = await this.createFlouciPayment(amount, orderId, isDirect, vendorKeys);

    return {
      session_data: {
        payment_id: flouciSession.payment_id,
        link: flouciSession.link,
        status: 'pending',
        is_direct: isDirect,
        store_id: storeId,
      },
    };
  }

  async authorizePayment(paymentSessionData: Record<string, unknown>, context: Record<string, unknown>): Promise<{ data: Record<string, unknown>; status: "authorized" | "error" | "requires_more" | "pending" | "canceled" }> {
    const paymentId = paymentSessionData.payment_id as string;
    const appToken = process.env.FLOUCI_APP_TOKEN || '';
    const appSecret = process.env.FLOUCI_APP_SECRET || '';

    try {
      const response = await fetch(`https://developers.flouci.com/api/verify_payment/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apppublic': appToken,
          'appsecret': appSecret
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.result.status === 'SUCCESS') {
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
      console.error('Flouci verification error', e);
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
    
    // Validate the incoming Flouci payload
    if (data.status === 'SUCCESS') {
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
