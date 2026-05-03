// pandamarket/backend/src/modules/payment-providers/konnect/service.ts
// =============================================================================
// PandaMarket — Konnect Payment Provider
// Supports Escrow (platform wallet) and Direct (vendor-owned API key for Pro+).
// Webhook callbacks are HMAC-verified against PD_KONNECT_WEBHOOK_SECRET.
// External HTTP calls are guarded by PD_KONNECT_ENABLED for mocked local dev.
// =============================================================================

import { AbstractPaymentProvider } from '@medusajs/framework/utils';
import type {
  PaymentProviderError,
  PaymentProviderSessionResponse,
  ProviderWebhookPayload,
} from '@medusajs/framework/types';

import { decryptAES256, verifyWebhookSignature } from '../../../../utils/crypto';
import { createServiceLogger } from '../../../../utils/logger';
import { SubscriptionPlan, PLAN_LIMITS } from '../../../../utils/constants';

const logger = createServiceLogger('KonnectProvider');

interface KonnectSession {
  payUrl: string;
  paymentRef: string;
}

interface KonnectVendorKeys {
  api_key: string;
  wallet_id?: string;
}
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/konnect/service.ts

interface PdStoreWithKonnectConfig {
  id: string;
  subscription_plan: SubscriptionPlan;
  payment_config?: {
    konnect?: {
      api_key_encrypted?: string;
      wallet_id?: string;
    };
  } | null;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreWithKonnectConfig[]>;
}

type ProviderStatus =
  | 'authorized'
  | 'error'
  | 'requires_more'
  | 'pending'
  | 'canceled'
  | 'captured';

interface PaymentContextShape {
  amount?: number;
  resource_id?: string;
  cart?: { metadata?: Record<string, unknown> | null };
  metadata?: Record<string, unknown> | null;
  session_data?: Record<string, unknown> | null;
}

=======

interface PdStoreWithKonnectConfig {
  id: string;
  subscription_plan: SubscriptionPlan;
  payment_config?: {
    konnect?: {
      api_key_encrypted?: string;
      wallet_id?: string;
    };
  } | null;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreWithKonnectConfig[]>;
}

type ProviderStatus =
  | 'authorized'
  | 'error'
  | 'requires_more'
  | 'pending'
  | 'canceled'
  | 'captured';

interface PaymentContextShape {
  amount?: number;
  resource_id?: string;
  cart?: { metadata?: Record<string, unknown> | null };
  metadata?: Record<string, unknown> | null;
  session_data?: Record<string, unknown> | null;
}

>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/konnect/service.ts
export class KonnectPaymentProvider extends AbstractPaymentProvider<Record<string, unknown>> {
  static identifier = 'pd-konnect';

  constructor(container: Record<string, unknown>, options: Record<string, unknown>) {
    super(container, options);
  }

  private get useRealApi(): boolean {
    return process.env.PD_KONNECT_ENABLED === 'true' && !!process.env.KONNECT_API_KEY;
  }

  private async createKonnectPayment(
    amount: number,
    orderId: string,
    isDirect: boolean,
    vendorKeys?: KonnectVendorKeys,
  ): Promise<KonnectSession> {
    const apiKey = isDirect && vendorKeys ? vendorKeys.api_key : process.env.KONNECT_API_KEY ?? '';
    const walletId =
      isDirect && vendorKeys ? vendorKeys.wallet_id ?? '' : process.env.KONNECT_WALLET_ID ?? '';

    if (!this.useRealApi && !isDirect) {
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/konnect/service.ts
=======
      if (process.env.PD_NODE_ENV === 'production') {
        throw new Error('PD_KONNECT_ENABLED and KONNECT_API_KEY must be configured for production payments');
      }
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/konnect/service.ts
      return {
        payUrl: `https://mock.konnect.local/pay/${orderId}`,
        paymentRef: `mock_konnect_${orderId}`,
      };
    }

    try {
      const response = await fetch('https://api.konnect.network/api/v2/payments/init-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({
          receiverWalletId: walletId,
          token: 'TND',
          amount: Math.round(amount * 1000),
          type: 'immediate',
          description: `PandaMarket Order ${orderId}`,
          acceptedPaymentMethods: ['bank_card', 'e-DINAR'],
          successUrl: `${process.env.PD_STORE_CORS}/checkout/success?order_id=${orderId}`,
          failUrl: `${process.env.PD_STORE_CORS}/checkout/fail?order_id=${orderId}`,
          theme: 'light',
        }),
      });
      const data = (await response.json()) as Partial<KonnectSession>;
      if (!data.payUrl || !data.paymentRef) throw new Error('Konnect did not return session data');
      return { payUrl: data.payUrl, paymentRef: data.paymentRef };
    } catch (err) {
      logger.error({ err, order_id: orderId }, 'Konnect init-payment failed');
      throw err;
    }
  }

  private async resolveVendorKeys(
    storeId: string | undefined,
  ): Promise<{ isDirect: boolean; vendorKeys?: KonnectVendorKeys }> {
    if (!storeId) return { isDirect: false };
    try {
      const storeService = (this as unknown as {
        container_: { resolve<T>(name: string): T };
      }).container_.resolve<IPdStoreService>('pdStoreService');
      const [store] = await storeService.listPdStores({ filters: { id: storeId } });
      if (!store) return { isDirect: false };
      if (!PLAN_LIMITS[store.subscription_plan]?.hasDirectPayment) return { isDirect: false };

      const konnect = store.payment_config?.konnect;
      if (!konnect?.api_key_encrypted) return { isDirect: false };

      return {
        isDirect: true,
        vendorKeys: {
          api_key: decryptAES256(konnect.api_key_encrypted),
          wallet_id: konnect.wallet_id,
        },
      };
    } catch (err) {
      logger.error({ err, store_id: storeId }, 'Falling back to escrow — vendor keys unresolved');
      return { isDirect: false };
    }
  }

  async initiatePayment(context: PaymentContextShape): Promise<PaymentProviderSessionResponse> {
    const amount = context.amount ?? 0;
    const orderId = context.resource_id ?? `temp_${Date.now()}`;
    const storeId =
      (context.cart?.metadata as { store_id?: string } | undefined)?.store_id ??
      (context.metadata as { store_id?: string } | undefined)?.store_id ??
      (context.session_data as { store_id?: string } | undefined)?.store_id;

    const { isDirect, vendorKeys } = await this.resolveVendorKeys(storeId);
    const session = await this.createKonnectPayment(amount, orderId, isDirect, vendorKeys);

    return {
      session_data: {
        payment_id: session.paymentRef,
        link: session.payUrl,
        status: 'pending',
        is_direct: isDirect,
        store_id: storeId ?? null,
      },
    };
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    _context: Record<string, unknown>,
  ): Promise<{ data: Record<string, unknown>; status: ProviderStatus }> {
    const paymentId = paymentSessionData.payment_id as string | undefined;
    if (!paymentId) return { data: paymentSessionData, status: 'error' };

    if (!this.useRealApi) {
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/konnect/service.ts
=======
      if (process.env.PD_NODE_ENV === 'production') {
        return { data: paymentSessionData, status: 'error' };
      }
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/konnect/service.ts
      return { data: paymentSessionData, status: 'pending' };
    }

    try {
      const response = await fetch(`https://api.konnect.network/api/v2/payments/${paymentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.KONNECT_API_KEY ?? '' },
      });
      const data = (await response.json()) as { payment?: { status?: string } };
      if (data.payment?.status === 'completed') {
        return { data: paymentSessionData, status: 'authorized' };
      }
      return { data: paymentSessionData, status: 'error' };
    } catch (err) {
      logger.error({ err, payment_id: paymentId }, 'Konnect verification failed');
      return { data: paymentSessionData, status: 'error' };
    }
  }

  async cancelPayment(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown> | PaymentProviderError> {
    return { ...data, status: 'canceled' };
  }

  async capturePayment(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown> | PaymentProviderError> {
    return { ...data, status: 'captured' };
  }

  async deletePayment(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown> | PaymentProviderError> {
    return data;
  }

  async getPaymentStatus(data: Record<string, unknown>): Promise<ProviderStatus> {
    const status = data.status as ProviderStatus | undefined;
    return status ?? 'pending';
  }

  async refundPayment(
    data: Record<string, unknown>,
    _refundAmount: number,
  ): Promise<Record<string, unknown> | PaymentProviderError> {
    return data;
  }

  async updatePayment(context: PaymentContextShape): Promise<PaymentProviderSessionResponse> {
    return { session_data: (context.session_data ?? {}) as Record<string, unknown> };
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload,
  ): Promise<{
    action: 'successful' | 'failed' | 'authorized' | 'captured' | 'not_supported';
    data: Record<string, unknown>;
  }> {
    const secret = process.env.PD_KONNECT_WEBHOOK_SECRET;
    const headers = (payload as unknown as { headers?: Record<string, string> }).headers ?? {};
    const rawBody =
      (payload as unknown as { rawData?: string | Buffer }).rawData ??
      JSON.stringify(payload.data ?? {});
    const rawBodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const signature = headers['x-pd-konnect-signature'] ?? headers['X-PD-Konnect-Signature'];

    if (!secret) {
      logger.error({}, 'PD_KONNECT_WEBHOOK_SECRET missing — rejecting webhook');
      return { action: 'not_supported', data: {} };
    }
    if (!signature || !verifyWebhookSignature(rawBodyString, signature, secret)) {
      logger.warn({}, 'Konnect webhook signature invalid');
      return { action: 'not_supported', data: {} };
    }

    const data = (payload.data ?? {}) as { status?: string };
    if (data.status === 'completed') {
      return { action: 'authorized', data: data as Record<string, unknown> };
    }
    return { action: 'failed', data: data as Record<string, unknown> };
  }
}
