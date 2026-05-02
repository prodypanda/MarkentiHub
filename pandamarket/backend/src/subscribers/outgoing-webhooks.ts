import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';
import { createHmac } from 'crypto';

export default async function outgoingWebhooksSubscriber({
  event: { data, name },
  container,
}: SubscriberArgs<any>) {
  // We want to notify vendors of events, e.g. order.placed
  
  const orderModuleService = container.resolve(Modules.ORDER);
  const storeModuleService: any = container.resolve('pdStoreModuleService');

  if (name !== 'order.placed') return;

  try {
    const order = await orderModuleService.retrieveOrder(data.id, {
      relations: ['items'],
    });

    if (!order) return;

    // Identify the store(s) involved in the order
    const storeIds = new Set<string>();
    for (const item of order.items || []) {
      const storeId = (item.metadata as Record<string, any>)?.store_id;
      if (storeId) storeIds.add(storeId);
    }

    for (const storeId of storeIds) {
      const store = await storeModuleService.retrieveStore(storeId);
      
      // Assume webhook config is in metadata for MVP
      const webhookUrl = (store.metadata as Record<string, any>)?.webhook_url;
      const webhookSecret = (store.metadata as Record<string, any>)?.webhook_secret;

      if (!webhookUrl) continue;

      const payload = {
        event: name,
        data: order,
        timestamp: new Date().toISOString(),
      };

      const payloadString = JSON.stringify(payload);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (webhookSecret) {
        const signature = createHmac('sha256', webhookSecret)
          .update(payloadString)
          .digest('hex');
        headers['x-pd-signature'] = signature;
      }

      // Fire and forget (in production, use a retry queue like BullMQ)
      fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: payloadString,
      }).catch(err => {
        console.error(`[Webhook Error] Store ${storeId}:`, err);
      });
    }

  } catch (error) {
    console.error('[Webhook Subscriber Error]', error);
  }
}

export const config: SubscriberConfig = {
  event: ['order.placed'],
};
