import { AbstractFulfillmentProviderService } from '@medusajs/framework/utils';
import { FulfillmentOption } from '@medusajs/framework/types';

type ProviderContainer = Record<string, unknown>;
type ProviderOptions = Record<string, unknown>;
type FulfillmentData = Record<string, unknown>;
type FulfillmentItems = unknown[];

interface LaPosteFulfillmentResult {
  tracking_number: string;
  status: 'created';
  tracking_url: string;
}

export class LaPosteFulfillmentProvider extends AbstractFulfillmentProviderService {
  static identifier = 'pd-laposte';

  constructor(_container: ProviderContainer, _options: ProviderOptions) {
    super();
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [
      {
        id: 'laposte-rapidposte',
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
    // Rapid-Poste generally costs 6.500 TND for standard small parcels
    return 6500;
  }

  async createFulfillment(
    _data: FulfillmentData,
    _items: FulfillmentItems,
    _order: FulfillmentData,
    _fulfillment: FulfillmentData,
  ): Promise<LaPosteFulfillmentResult> {
    if (process.env.PD_NODE_ENV === 'production') {
      throw new Error('La Poste production fulfillment integration is not configured');
    }
    // Mocking La Poste Rapid Poste API
    const mockTracking = 'RR' + Math.floor(Math.random() * 100000000) + 'TN';
    return {
      tracking_number: mockTracking,
      status: 'created',
      tracking_url: `http://www.rapidposte.poste.tn/fr/Suivi.html?code=${mockTracking}`
    };
  }

  async cancelFulfillment(_fulfillmentData: FulfillmentData): Promise<Record<string, never>> {
    return {};
  }

  async createReturnFulfillment(_fulfillmentData: FulfillmentData): Promise<Record<string, never>> {
    return {};
  }
}
