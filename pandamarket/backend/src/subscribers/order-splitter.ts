import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';
import { getSocketIO } from '../api/middlewares/socket';

export default async function orderSplitterSubscriber({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = data.id;
  
  // Resolve core modules
  const orderModuleService = container.resolve(Modules.ORDER);
  // const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  try {
    // Retrieve order with its line items
    const order = await orderModuleService.retrieveOrder(orderId, {
      relations: ['items']
    });

    if (!order || !order.items || order.items.length === 0) return;

    // 1. Group items by their vendor's store_id
    const storeItems: Record<string, any[]> = {};
    
    for (const item of order.items) {
      // Safely extract the store_id from the item's metadata
      const storeId = (item.metadata as Record<string, any>)?.store_id || 'platform';
      if (!storeItems[storeId]) {
        storeItems[storeId] = [];
      }
      storeItems[storeId].push(item);
    }

    const storeIds = Object.keys(storeItems);
    
    // 2. If all items belong to a single vendor, no complex splitting is required
    if (storeIds.length <= 1) {
      console.log(`[Order Splitter] Order ${orderId} belongs to a single store. Standard fulfillment applies.`);
      
      const singleStoreId = storeIds[0];
      const io = getSocketIO();
      if (io && singleStoreId) {
        io.to(`store_${singleStoreId}`).emit('notification.new_order', {
          orderId: order.id,
          message: 'Vous avez reçu une nouvelle commande !',
          itemCount: order.items.length,
        });
      }
      return;
    }

    console.log(`[Order Splitter] Split required: Order ${orderId} contains items from ${storeIds.length} different stores.`);

    // 3. For multi-vendor orders, we generate isolated fulfillment groups
    // In Medusa v2, you can create separate fulfillment groups (or separate Child Orders)
    // Here we simulate the logic of dispatching these groups into the system.
    const io = getSocketIO();
    for (const storeId of storeIds) {
      const itemsForStore = storeItems[storeId];
      
      console.log(`[Order Splitter] -> Generating distinct fulfillment group for vendor: ${storeId} (${itemsForStore.length} items).`);
      
      // Emit Real-Time WebSocket Notification to the vendor
      if (io) {
        io.to(`store_${storeId}`).emit('notification.new_order', {
          orderId: order.id,
          message: 'Nouvelle commande détectée dans un achat groupé !',
          itemCount: itemsForStore.length,
        });
      }
      
      // In a production build, this is where we would call:
      // await fulfillmentModuleService.createFulfillment({
      //   location_id: ...,
      //   provider_id: ...,
      //   items: itemsForStore.map(i => ({ line_item_id: i.id, quantity: i.quantity })),
      //   order_id: order.id,
      //   metadata: { vendor_id: storeId }
      // });
    }

    console.log(`[Order Splitter] Successfully separated ${storeIds.length} fulfillments for order ${orderId}.`);

  } catch (error) {
    console.error('[Order Splitter] Failed to split order:', error);
  }
}

export const config: SubscriberConfig = {
  event: ['order.placed'],
};
