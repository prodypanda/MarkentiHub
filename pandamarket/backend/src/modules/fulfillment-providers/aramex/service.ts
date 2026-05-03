import { AbstractFulfillmentProviderService } from '@medusajs/framework/utils';
import { FulfillmentOption } from '@medusajs/framework/types';

type ProviderContainer = Record<string, unknown>;
type ProviderOptions = Record<string, unknown>;
type FulfillmentData = Record<string, unknown>;
type FulfillmentItems = unknown[];

interface AramexFulfillmentResult {
  waybill_number: string;
  status: 'created';
  tracking_url: string;
}

export class AramexFulfillmentProvider extends AbstractFulfillmentProviderService {
  static identifier = 'pd-aramex';

  constructor(_container: ProviderContainer, _options: ProviderOptions) {
    super();
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [
      {
        id: 'aramex-standard',
        is_return: false,
      },
    ];
  }

  async validateFulfillmentData(
    _optionData: FulfillmentData,
    data: FulfillmentData,
    _context: FulfillmentData,
  ): Promise<FulfillmentData> {
    return data;
  }

  async validateOption(_data: Record<string, unknown>): Promise<boolean> {
    return true;
  }

  async canCalculate(_data: FulfillmentData): Promise<boolean> {
    return true;
  }

  async calculatePrice(
    _optionData: FulfillmentData,
    _data: FulfillmentData,
    _context: FulfillmentData,
  ): Promise<number> {
    // Mocking domestic Aramex Tunisia logic: 8 TND base rate
    return 8000;
  }

  async createFulfillment(
    _data: FulfillmentData,
    _items: FulfillmentItems,
    _order: FulfillmentData,
    _fulfillment: FulfillmentData,
  ): Promise<AramexFulfillmentResult> {
    if (process.env.PD_NODE_ENV === 'production') {
      throw new Error('Aramex production fulfillment integration is not configured');
    }
    // Mocking Aramex API Shipment Creation
    // In reality, this posts to https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments
    const mockWaybill = 'AWB' + Math.floor(Math.random() * 1000000000);
    return {
      waybill_number: mockWaybill,
      status: 'created',
      tracking_url: `https://www.aramex.com/track/results?mode=0&ShipmentNumber=${mockWaybill}`
    };
  }

  async cancelFulfillment(_fulfillmentData: FulfillmentData): Promise<Record<string, never>> {
    return {};
  }

  async createReturnFulfillment(_fulfillmentData: FulfillmentData): Promise<Record<string, never>> {
    return {};
  }
}
