import { AbstractFulfillmentProviderService } from '@medusajs/framework/utils';
import { FulfillmentOption } from '@medusajs/framework/types';

export class LaPosteFulfillmentProvider extends AbstractFulfillmentProviderService {
  static identifier = 'pd-laposte';

  constructor(_container: any, _options: any) {
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

  async validateFulfillmentData(_optionData: Record<string, unknown>, data: Record<string, unknown>, _context: Record<string, unknown>): Promise<any> {
    return data;
  }

  async validateOption(_data: Record<string, unknown>): Promise<boolean> {
    return true;
  }

  async canCalculate(_data: any): Promise<boolean> {
    return true;
  }

  async calculatePrice(_optionData: any, _data: any, _context: any): Promise<any> {
    // Rapid-Poste generally costs 6.500 TND for standard small parcels
    return 6500;
  }

  async createFulfillment(_data: any, _items: any, _order: any, _fulfillment: any): Promise<any> {
    // Mocking La Poste Rapid Poste API
    const mockTracking = 'RR' + Math.floor(Math.random() * 100000000) + 'TN';
    return {
      tracking_number: mockTracking,
      status: 'created',
      tracking_url: `http://www.rapidposte.poste.tn/fr/Suivi.html?code=${mockTracking}`
    };
  }

  async cancelFulfillment(_fulfillmentData: Record<string, unknown>): Promise<any> {
    return {};
  }

  async createReturnFulfillment(_fulfillmentData: any): Promise<any> {
    return {};
  }
}
