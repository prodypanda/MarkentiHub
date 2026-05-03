import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';
import { getSocketIO } from '../api/middlewares/socket';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('OrderSplitterSubscriber');

interface OrderItemLike {
  id?: string;
  quantity?: number;
  metadata?: Record<string, unknown> | null;
}

interface OrderLike {
  id: string;
  items?: OrderItemLike[] | null;
}

interface IOrderModuleService {
  retrieveOrder(id: string, options: { relations: string[] }): Promise<OrderLike | null>;
}

export default async function orderSplitterSubscriber({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = data.id;
  
  // Resolve core modules
  const orderModuleService = container.resolve(Modules.ORDER) as unknown as IOrderModuleService;
  // const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  try {
    // Retrieve order with its line items
    const order = await orderModuleService.retrieveOrder(orderId, {
      relations: ['items']
    });

    if (!order || !order.items || order.items.length === 0) return;

    // 1. Group items by their vendor's store_id
    const storeItems: Record<string, OrderItemLike[]> = {};
    
    for (const item of order.items) {
      // Safely extract the store_id from the item's metadata
      const storeId = item.metadata?.store_id;
      if (typeof storeId !== 'string' || !storeId) {
        logger.error({ order_id: orderId, item_id: item.id }, 'Order item missing store_id metadata');
        continue;
      }
      if (!storeItems[storeId]) {
        storeItems[storeId] = [];
      }
      storeItems[storeId].push(item);
    }

    const storeIds = Object.keys(storeItems);
    if (storeIds.length === 0) {
      logger.error({ order_id: orderId }, 'No vendor store groups could be derived for order');
      return;
    }
    
    // 2. If all items belong to a single vendor, no complex splitting is required
    if (storeIds.length <= 1) {
      logger.info({ order_id: orderId, store_id: storeIds[0] }, 'Order belongs to a single store');
      
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

    logger.info({ order_id: orderId, store_count: storeIds.length }, 'Order split required');

    // 3. For multi-vendor orders, we generate isolated fulfillment groups
    // In Medusa v2, you can create separate fulfillment groups (or separate Child Orders)
    // Here we simulate the logic of dispatching these groups into the system.
    const io = getSocketIO();
    for (const storeId of storeIds) {
      const itemsForStore = storeItems[storeId];
      
      logger.info({ order_id: orderId, store_id: storeId, item_count: itemsForStore.length }, 'Generating vendor fulfillment group');
      
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

    logger.info({ order_id: orderId, store_count: storeIds.length }, 'Order fulfillment groups separated');

  } catch (error) {
    logger.error({ err: error, order_id: orderId }, 'Failed to split order');
  }
}

export const config: SubscriberConfig = {
  event: ['order.placed'],
};
