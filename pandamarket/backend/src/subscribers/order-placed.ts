import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';

export default async function orderPlacedSubscriber({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderModuleService = container.resolve(Modules.ORDER);
  const pdWalletService: any = container.resolve('pdWalletService');
  const storeModuleService: any = container.resolve('pdStoreModuleService');
  
  const orderId = data.id;
  const order = await orderModuleService.retrieveOrder(orderId, {
    relations: ['items', 'payment_collections'],
  });

  if (!order) return;

  // Split order logic:
  // In PandaMarket MVP, we assume 1 order = 1 store. 
  // If multi-vendor cart is implemented, order items dictate the store distribution.
  // We'll calculate the total per store and process the escrow.

  // Group items by store_id
  const storeTotals: Record<string, number> = {};
  for (const item of order.items || []) {
    // metadata is where we store the store_id of the product
    const storeId = (item.metadata as Record<string, any>)?.store_id;
    if (storeId) {
      if (!storeTotals[storeId]) storeTotals[storeId] = 0;
      // unit_price * quantity
      storeTotals[storeId] += (item.unit_price * item.quantity);
    }
  }

  // Determine if payment was direct or escrow
  // A payment provider like 'pd-flouci' or 'pd-konnect' (without vendor keys) goes to Hub.
  // A direct payment goes straight to vendor. For MVP, we assume all are Escrow unless
  // we specifically implement Direct.
  
  // For each store involved in the order, process escrow
  for (const [storeId, amount] of Object.entries(storeTotals)) {
    // 1. Check if vendor is in Direct mode
    const store = await storeModuleService.retrieveStore(storeId);
    // Let's check plan (in a real scenario, use pdSubscriptionService to verify feature access)
    // For now we assume if it's not direct, it's escrow.
    const isDirect = store.payment_config?.flouci_public_key ? true : false;

    if (!isDirect) {
      // 2. Escrow Mode: Credit wallet minus commission
      const commissionRate = store.payment_config?.commission_rate || 0.15; // 15% default
      await pdWalletService.processSale(storeId, amount, commissionRate, orderId);
    }
  }
}

export const config: SubscriberConfig = {
  event: ['order.placed'],
};
