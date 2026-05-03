import { describe, it, expect, beforeEach, vi } from 'vitest';
import orderSplitterSubscriber from '../order-splitter';

// Mock the socket so we don't trigger network events during tests
vi.mock('../../api/middlewares/socket', () => ({
  getSocketIO: vi.fn().mockReturnValue({
    to: vi.fn().mockReturnThis(),
    emit: vi.fn()
  })
}));

describe('Order Splitter Subscriber', () => {
  let mockContainer: any;
  let mockOrderModule: any;

  beforeEach(() => {
    mockOrderModule = {
      retrieveOrder: vi.fn()
    };

    mockContainer = {
      resolve: vi.fn((moduleName: string) => {
        if (moduleName === 'order') return mockOrderModule;
        if (moduleName === 'fulfillment') return {};
        return {};
      })
    };
  });

  it('should early-exit and not split if order has only 1 vendor', async () => {
    const mockOrder = {
      id: 'order_1',
      items: [
        { id: 'item_1', metadata: { store_id: 'store_A' } },
        { id: 'item_2', metadata: { store_id: 'store_A' } }
      ]
    };
    mockOrderModule.retrieveOrder.mockResolvedValue(mockOrder);

    const consoleSpy = vi.spyOn(console, 'log');

    await orderSplitterSubscriber({
      event: { data: { id: 'order_1' } },
      container: mockContainer
    } as any);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('belongs to a single store'));
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Split required'));
  });

  it('should group items and simulate splitting for multi-vendor carts', async () => {
    const mockOrder = {
      id: 'order_2',
      items: [
        { id: 'item_1', metadata: { store_id: 'store_A' } },
        { id: 'item_2', metadata: { store_id: 'store_A' } },
        { id: 'item_3', metadata: { store_id: 'store_B' } },
        { id: 'item_4', metadata: { store_id: 'store_C' } }
      ]
    };
    mockOrderModule.retrieveOrder.mockResolvedValue(mockOrder);

    const consoleSpy = vi.spyOn(console, 'log');

    await orderSplitterSubscriber({
      event: { data: { id: 'order_2' } },
      container: mockContainer
    } as any);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Split required: Order order_2 contains items from 3 different stores'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Generating distinct fulfillment group for vendor: store_A (2 items)'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Generating distinct fulfillment group for vendor: store_B (1 items)'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Generating distinct fulfillment group for vendor: store_C (1 items)'));
  });
});
