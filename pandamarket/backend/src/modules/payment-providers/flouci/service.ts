// pandamarket/backend/src/modules/payment-providers/flouci/service.ts
// =============================================================================
// PandaMarket — Flouci Payment Provider
// Supports both Escrow (platform keys) and Direct (vendor-owned keys for Pro+).
// All webhook callbacks are HMAC-verified against PD_FLOUCI_WEBHOOK_SECRET.
// External HTTP calls are guarded by env toggles to keep local dev functional.
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

const logger = createServiceLogger('FlouciProvider');

interface FlouciSession {
  payment_id: string;
  link: string;
}

interface FlouciVendorKeys {
  public_key: string;
  secret_key: string;
}

interface PdStoreWithFlouciConfig {
  id: string;
  subscription_plan: SubscriptionPlan;
  payment_config?: {
    flouci?: {
      public_key?: string;
      secret_key_encrypted?: string;
    };
  } | null;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreWithFlouciConfig[]>;
}
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts

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

>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
/**
 * FlouciPaymentProvider handles both escrow (platform keys) and direct
 * (vendor keys for Pro+ plans) payment sessions.
 */
export class FlouciPaymentProvider extends AbstractPaymentProvider<Record<string, unknown>> {
  static identifier = 'pd-flouci';

  constructor(container: Record<string, unknown>, options: Record<string, unknown>) {
    super(container, options);
  }

  private get useRealApi(): boolean {
    return process.env.PD_FLOUCI_ENABLED === 'true' && !!process.env.FLOUCI_APP_TOKEN;
  }

  private async createFlouciPayment(
    amount: number,
    orderId: string,
    isDirect: boolean,
    vendorKeys?: FlouciVendorKeys,
  ): Promise<FlouciSession> {
    const appToken = isDirect && vendorKeys ? vendorKeys.public_key : process.env.FLOUCI_APP_TOKEN ?? '';
    const appSecret = isDirect && vendorKeys ? vendorKeys.secret_key : process.env.FLOUCI_APP_SECRET ?? '';

    if (!this.useRealApi && !isDirect) {
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
=======
      if (process.env.PD_NODE_ENV === 'production') {
        throw new Error('PD_FLOUCI_ENABLED and FLOUCI_APP_TOKEN must be configured for production payments');
      }
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
=======
      if (process.env.PD_NODE_ENV === 'production') {
        throw new Error('PD_FLOUCI_ENABLED and FLOUCI_APP_TOKEN must be configured for production payments');
      }
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
=======
      if (process.env.PD_NODE_ENV === 'production') {
        throw new Error('PD_FLOUCI_ENABLED and FLOUCI_APP_TOKEN must be configured for production payments');
      }
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
      // Local dev / mocked mode — return a deterministic stub session.
      return {
        payment_id: `mock_flouci_${orderId}`,
        link: `https://mock.flouci.local/pay/${orderId}`,
      };
    }

    try {
      const response = await fetch('https://developers.flouci.com/api/generate_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_token: appToken,
          app_secret: appSecret,
          accept_card: 'true',
          amount: Math.round(amount * 1000),
          success_link: `${process.env.PD_STORE_CORS}/checkout/success?order_id=${orderId}`,
          fail_link: `${process.env.PD_STORE_CORS}/checkout/fail?order_id=${orderId}`,
          session_timeout_secs: 1200,
          developer_tracking_id: orderId,
        }),
      });
      const data = (await response.json()) as { result?: FlouciSession };
      if (!data.result) throw new Error('Flouci did not return a result object');
      return data.result;
    } catch (err) {
      logger.error({ err, order_id: orderId }, 'Flouci generate_payment failed');
      throw err;
    }
  }

  private async resolveVendorKeys(
    storeId: string | undefined,
  ): Promise<{ isDirect: boolean; vendorKeys?: FlouciVendorKeys }> {
    if (!storeId) return { isDirect: false };
    try {
      const storeService = (this as unknown as {
        container_: { resolve<T>(name: string): T };
      }).container_.resolve<IPdStoreService>('pdStoreService');
      const [store] = await storeService.listPdStores({ filters: { id: storeId } });
      if (!store) return { isDirect: false };
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
      if (!PLAN_LIMITS[store.subscription_plan]?.hasDirectPayment) return { isDirect: false };
=======
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
      const plan = store.subscription_plan;
      if (!plan || !PLAN_LIMITS[plan]) {
        logger.error({ store_id: storeId }, 'Store has no valid subscription plan for direct payments');
        return { isDirect: false };
      }
      if (!PLAN_LIMITS[plan].hasDirectPayment) return { isDirect: false };
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts

      const flouci = store.payment_config?.flouci;
      if (!flouci?.public_key || !flouci.secret_key_encrypted) return { isDirect: false };

      return {
        isDirect: true,
        vendorKeys: {
          public_key: flouci.public_key,
          secret_key: decryptAES256(flouci.secret_key_encrypted),
        },
      };
    } catch (err) {
      logger.error({ err, store_id: storeId }, 'Falling back to escrow — vendor keys unresolved');
      return { isDirect: false };
    }
  }
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts

  async initiatePayment(context: PaymentContextShape): Promise<PaymentProviderSessionResponse> {
    const amount = context.amount ?? 0;
    const orderId = context.resource_id ?? `temp_${Date.now()}`;
    const storeId =
      (context.cart?.metadata as { store_id?: string } | undefined)?.store_id ??
      (context.metadata as { store_id?: string } | undefined)?.store_id ??
      (context.session_data as { store_id?: string } | undefined)?.store_id;
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts

=======
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts

  async initiatePayment(context: PaymentContextShape): Promise<PaymentProviderSessionResponse> {
    const amount = context.amount ?? 0;
    const orderId = context.resource_id ?? `temp_${Date.now()}`;
    const storeId =
      (context.cart?.metadata as { store_id?: string } | undefined)?.store_id ??
      (context.metadata as { store_id?: string } | undefined)?.store_id ??
      (context.session_data as { store_id?: string } | undefined)?.store_id;

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
=======

>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
    const { isDirect, vendorKeys } = await this.resolveVendorKeys(storeId);
    const session = await this.createFlouciPayment(amount, orderId, isDirect, vendorKeys);

    return {
      session_data: {
        payment_id: session.payment_id,
        link: session.link,
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
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
=======
      if (process.env.PD_NODE_ENV === 'production') {
        return { data: paymentSessionData, status: 'error' };
      }
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
=======
      if (process.env.PD_NODE_ENV === 'production') {
        return { data: paymentSessionData, status: 'error' };
      }
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
=======
      if (process.env.PD_NODE_ENV === 'production') {
        return { data: paymentSessionData, status: 'error' };
      }
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/modules/payment-providers/flouci/service.ts
      return { data: paymentSessionData, status: 'pending' };
    }

    try {
      const response = await fetch(`https://developers.flouci.com/api/verify_payment/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apppublic: process.env.FLOUCI_APP_TOKEN ?? '',
          appsecret: process.env.FLOUCI_APP_SECRET ?? '',
        },
      });
      const data = (await response.json()) as { success?: boolean; result?: { status?: string } };
      if (data.success && data.result?.status === 'SUCCESS') {
        return { data: paymentSessionData, status: 'authorized' };
      }
      return { data: paymentSessionData, status: 'error' };
    } catch (err) {
      logger.error({ err, payment_id: paymentId }, 'Flouci verification failed');
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

  /**
   * Verify HMAC signature before honoring webhook events.
   * Expects header `x-pd-flouci-signature` signed with PD_FLOUCI_WEBHOOK_SECRET.
   */
  async getWebhookActionAndData(
    payload: ProviderWebhookPayload,
  ): Promise<{
    action: 'successful' | 'failed' | 'authorized' | 'captured' | 'not_supported';
    data: Record<string, unknown>;
  }> {
    const secret = process.env.PD_FLOUCI_WEBHOOK_SECRET;
    const headers = (payload as unknown as { headers?: Record<string, string> }).headers ?? {};
    const rawBody =
      (payload as unknown as { rawData?: string | Buffer }).rawData ??
      JSON.stringify(payload.data ?? {});
    const rawBodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const signature = headers['x-pd-flouci-signature'] ?? headers['X-PD-Flouci-Signature'];

    if (!secret) {
      logger.error({}, 'PD_FLOUCI_WEBHOOK_SECRET missing — rejecting webhook');
      return { action: 'not_supported', data: {} };
    }
    if (!signature || !verifyWebhookSignature(rawBodyString, signature, secret)) {
      logger.warn({}, 'Flouci webhook signature invalid');
      return { action: 'not_supported', data: {} };
    }

    const data = (payload.data ?? {}) as { status?: string };
    if (data.status === 'SUCCESS') {
      return { action: 'authorized', data: data as Record<string, unknown> };
    }
    return { action: 'failed', data: data as Record<string, unknown> };
  }
}
