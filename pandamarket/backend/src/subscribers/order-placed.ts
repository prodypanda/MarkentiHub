// pandamarket/backend/src/subscribers/order-placed.ts
// =============================================================================
// PandaMarket — Order Placed Subscriber
// Credits each vendor's wallet (escrow mode) using the commission rate from
// their subscription plan. Direct-pay plans skip the credit (funds already
// landed directly on the vendor's PSP account).
// =============================================================================

import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';

import { SubscriptionPlan, PLAN_LIMITS, PD_EVENTS } from '../utils/constants';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('OrderPlacedSubscriber');

interface PdStoreLike {
  id: string;
  subscription_plan?: SubscriptionPlan | null;
  payment_config?: Record<string, unknown> | null;
}

interface IPdWalletService {
  creditSale(
    storeId: string,
    grossAmount: number,
    commissionRate: number,
    orderId: string,
  ): Promise<void>;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreLike[]>;
}

interface OrderItemLike {
  unit_price: number;
  quantity: number;
  metadata?: Record<string, unknown> | null;
}

interface OrderLike {
  id: string;
  items?: OrderItemLike[] | null;
}

function isDirectPayment(store: PdStoreLike): boolean {
  const plan = store.subscription_plan ?? SubscriptionPlan.Free;
  const hasDirectPay = PLAN_LIMITS[plan]?.hasDirectPayment ?? false;
  if (!hasDirectPay) return false;
  const cfg = store.payment_config ?? {};
  return Boolean(
    (cfg as { flouci?: unknown; konnect?: unknown }).flouci ||
      (cfg as { flouci?: unknown; konnect?: unknown }).konnect,
  );
}

function commissionRateFor(store: PdStoreLike): number {
  const plan = store.subscription_plan ?? SubscriptionPlan.Free;
  return PLAN_LIMITS[plan]?.commissionRate ?? 0.15;
}

export default async function orderPlacedSubscriber({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>): Promise<void> {
  const orderModuleService = container.resolve(Modules.ORDER);
  const pdWalletService = container.resolve<IPdWalletService>('pdWalletService');
  const pdStoreService = container.resolve<IPdStoreService>('pdStoreService');

  const orderId = data.id;
  const order = (await orderModuleService.retrieveOrder(orderId, {
    relations: ['items', 'payment_collections'],
  })) as OrderLike | null;

  if (!order || !order.items || order.items.length === 0) {
    logger.debug({ order_id: orderId }, 'Order not found or has no items; skipping');
    return;
  }

  // Group totals by store_id from line-item metadata.
  const storeTotals = new Map<string, number>();
  for (const item of order.items) {
    const meta = (item.metadata ?? {}) as { store_id?: string };
    const storeId = meta.store_id;
    if (!storeId) continue;
    const subtotal = (item.unit_price ?? 0) * (item.quantity ?? 0);
    storeTotals.set(storeId, (storeTotals.get(storeId) ?? 0) + subtotal);
  }

  if (storeTotals.size === 0) {
    logger.warn(
      { order_id: orderId },
      'Order placed but no items carried a store_id in metadata; wallet not credited',
    );
    return;
  }

  for (const [storeId, grossAmount] of storeTotals) {
    try {
      const [store] = await pdStoreService.listPdStores({ filters: { id: storeId } });
      if (!store) {
        logger.warn({ order_id: orderId, store_id: storeId }, 'Store not found for order item');
        continue;
      }

      if (isDirectPayment(store)) {
        logger.info(
          { order_id: orderId, store_id: storeId, amount: grossAmount },
          'Direct-pay plan — wallet credit skipped (funds sent directly to vendor PSP)',
        );
        continue;
      }

      const commissionRate = commissionRateFor(store);
      await pdWalletService.creditSale(storeId, grossAmount, commissionRate, orderId);

      logger.info(
        {
          order_id: orderId,
          store_id: storeId,
          gross: grossAmount,
          commission_rate: commissionRate,
          event: PD_EVENTS.ORDER_PLACED,
        },
        'Wallet credited for order',
      );
    } catch (err) {
      logger.error(
        { err, order_id: orderId, store_id: storeId },
        'Failed to credit wallet for order item',
      );
    }
  }
}

export const config: SubscriberConfig = {
  event: ['order.placed'],
};
