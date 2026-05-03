import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Modules } from '@medusajs/framework/utils';
import type { SubscriberArgs } from '@medusajs/framework';
import orderSplitterSubscriber from '../order-splitter';

const socketMocks = vi.hoisted(() => ({
  to: vi.fn(),
  emit: vi.fn(),
}));

// Mock the socket so we don't trigger network events during tests
vi.mock('../../api/middlewares/socket', () => ({
  getSocketIO: vi.fn().mockReturnValue({
    to: socketMocks.to,
    emit: socketMocks.emit,
  })
}));

interface MockOrderItem {
  id: string;
  metadata: { store_id: string };
}

interface MockOrder {
  id: string;
  items: MockOrderItem[];
}

interface MockOrderModule {
  retrieveOrder: ReturnType<typeof vi.fn>;
}

interface MockContainer {
  resolve: ReturnType<typeof vi.fn>;
}

function createSubscriberArgs(orderId: string, container: MockContainer): SubscriberArgs<{ id: string }> {
  return {
    event: { data: { id: orderId } },
    container,
  } as unknown as SubscriberArgs<{ id: string }>;
}

describe('Order Splitter Subscriber', () => {
  let mockContainer: MockContainer;
  let mockOrderModule: MockOrderModule;

  beforeEach(() => {
    socketMocks.to.mockReturnValue({ emit: socketMocks.emit });
    socketMocks.emit.mockReset();
    socketMocks.to.mockClear();

    mockOrderModule = {
      retrieveOrder: vi.fn()
    };

    mockContainer = {
      resolve: vi.fn((moduleName: string) => {
        if (moduleName === Modules.ORDER) return mockOrderModule;
        return {};
      })
    };
  });

  it('should early-exit and not split if order has only 1 vendor', async () => {
    const mockOrder: MockOrder = {
      id: 'order_1',
      items: [
        { id: 'item_1', metadata: { store_id: 'store_A' } },
        { id: 'item_2', metadata: { store_id: 'store_A' } }
      ]
    };
    mockOrderModule.retrieveOrder.mockResolvedValue(mockOrder);

    await orderSplitterSubscriber(createSubscriberArgs('order_1', mockContainer));

    expect(socketMocks.to).toHaveBeenCalledWith('store_store_A');
    expect(socketMocks.emit).toHaveBeenCalledWith('notification.new_order', {
      orderId: 'order_1',
      message: 'Vous avez reçu une nouvelle commande !',
      itemCount: 2,
    });
  });

  it('should group items and simulate splitting for multi-vendor carts', async () => {
    const mockOrder: MockOrder = {
      id: 'order_2',
      items: [
        { id: 'item_1', metadata: { store_id: 'store_A' } },
        { id: 'item_2', metadata: { store_id: 'store_A' } },
        { id: 'item_3', metadata: { store_id: 'store_B' } },
        { id: 'item_4', metadata: { store_id: 'store_C' } }
      ]
    };
    mockOrderModule.retrieveOrder.mockResolvedValue(mockOrder);

    await orderSplitterSubscriber(createSubscriberArgs('order_2', mockContainer));

    expect(socketMocks.to).toHaveBeenCalledWith('store_store_A');
    expect(socketMocks.to).toHaveBeenCalledWith('store_store_B');
    expect(socketMocks.to).toHaveBeenCalledWith('store_store_C');
    expect(socketMocks.emit).toHaveBeenCalledTimes(3);
    expect(socketMocks.emit).toHaveBeenCalledWith('notification.new_order', {
      orderId: 'order_2',
      message: 'Nouvelle commande détectée dans un achat groupé !',
      itemCount: 2,
    });
    expect(socketMocks.emit).toHaveBeenCalledWith('notification.new_order', {
      orderId: 'order_2',
      message: 'Nouvelle commande détectée dans un achat groupé !',
      itemCount: 1,
    });
  });
});
