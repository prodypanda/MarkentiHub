// pandamarket/backend/src/subscribers/outgoing-webhooks.ts
// =============================================================================
// PandaMarket — Outgoing Webhooks Dispatcher
// On order.placed, pushes an HMAC-signed payload to each vendor's configured
// webhook URL. Never throws — failures are logged and surface as retry jobs.
// =============================================================================

import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';

import { signWebhookPayload } from '../utils/crypto';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('OutgoingWebhooksSubscriber');

interface OrderItemLike {
  metadata?: Record<string, unknown> | null;
}

interface OrderLike {
  id: string;
  items?: OrderItemLike[] | null;
}

interface PdStoreLike {
  id: string;
  settings?: Record<string, unknown> | null;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreLike[]>;
}

interface IOrderModuleService {
  retrieveOrder(id: string, opts?: Record<string, unknown>): Promise<OrderLike | null>;
}

export default async function outgoingWebhooksSubscriber({
  event: { data, name },
  container,
}: SubscriberArgs<{ id: string }>): Promise<void> {
  if (name !== 'order.placed') return;

  const orderModuleService = container.resolve(Modules.ORDER) as unknown as IOrderModuleService;
  const pdStoreService = container.resolve<IPdStoreService>('pdStoreService');

  let order: OrderLike | null;
  try {
    order = await orderModuleService.retrieveOrder(data.id, { relations: ['items'] });
  } catch (err) {
    logger.error({ err, order_id: data.id }, 'Failed to retrieve order for webhook dispatch');
    return;
  }
  if (!order) return;

  const storeIds = new Set<string>();
  for (const item of order.items ?? []) {
    const meta = (item.metadata ?? {}) as { store_id?: string };
    if (meta.store_id) storeIds.add(meta.store_id);
  }

  for (const storeId of storeIds) {
    try {
      const [store] = await pdStoreService.listPdStores({ filters: { id: storeId } });
      if (!store) continue;

      const settings = (store.settings ?? {}) as {
        webhook_url?: string;
        webhook_secret?: string;
      };

      if (!settings.webhook_url) continue;

      const payload = {
        event: 'pd.order.placed',
        data: order,
        timestamp: new Date().toISOString(),
      };
      const payloadString = JSON.stringify(payload);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      if (settings.webhook_secret) {
        headers['X-PD-Signature'] = signWebhookPayload(payloadString, settings.webhook_secret);
      }

      try {
        const response = await fetch(settings.webhook_url, {
          method: 'POST',
          headers,
          body: payloadString,
        });
        if (!response.ok) {
          logger.warn(
            { store_id: storeId, status: response.status, url: settings.webhook_url },
            'Vendor webhook returned non-2xx',
          );
        }
      } catch (err) {
        logger.warn({ err, store_id: storeId }, 'Vendor webhook dispatch failed');
      }
    } catch (err) {
      logger.error({ err, store_id: storeId }, 'Webhook loop iteration failed');
    }
  }
}

export const config: SubscriberConfig = {
  event: ['order.placed'],
};
