import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';
import jwt from 'jsonwebtoken';
// import { sendEmail } from '../utils/email';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('DigitalFulfillmentSubscriber');

interface OrderItemLike {
  title?: string | null;
  product_id?: string | null;
}

interface OrderLike {
  id: string;
  email?: string | null;
  customer_id?: string | null;
  items?: OrderItemLike[] | null;
}

interface ProductLike {
  id: string;
  metadata?: Record<string, unknown> | null;
}

interface IOrderModuleService {
  retrieveOrder(id: string, options: { relations: string[] }): Promise<OrderLike | null>;
}

interface IProductModuleService {
  retrieveProduct(id: string): Promise<ProductLike>;
}

function getJwtSecret(): string {
  const secret = process.env.PD_JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('PD_JWT_SECRET must be set (>= 16 chars)');
  }
  return secret;
}

function getPublicApiBaseUrl(): string {
  const baseUrl =
    process.env.PD_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_MEDUSA_URL ??
    process.env.PD_STORE_CORS?.split(',')[0];
  if (!baseUrl) {
    throw new Error('PD_PUBLIC_API_URL or NEXT_PUBLIC_MEDUSA_URL must be set for digital delivery links');
  }
  return baseUrl.replace(/\/$/, '');
}

export default async function digitalFulfillmentSubscriber({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderModuleService = container.resolve(Modules.ORDER) as unknown as IOrderModuleService;
  const productModuleService = container.resolve(Modules.PRODUCT) as unknown as IProductModuleService;

  try {
    const order = await orderModuleService.retrieveOrder(data.id, {
      relations: ['items'],
    });

    if (!order || !order.items) return;

    const digitalItems = [];

    for (const item of order.items) {
      // Find the product
      const product_id = item.product_id;
      if (!product_id) continue;

      const product = await productModuleService.retrieveProduct(product_id);
      const isDigital = product.metadata?.is_digital;

      if (isDigital) {
        // Generate a token for the download
        const downloadToken = jwt.sign(
          {
            sub: order.customer_id ?? order.email ?? order.id,
            product_id,
            order_id: order.id,
          },
          getJwtSecret(),
          { expiresIn: '7d' },
        );
        const downloadUrl = `${getPublicApiBaseUrl()}/api/pd/digital/${product_id}/download?token=${downloadToken}`;
        
        digitalItems.push({
          title: item.title,
          url: downloadUrl,
        });
      }
    }

    if (digitalItems.length > 0) {
      // 1. Auto fulfill the digital items via Medusa API (omitted for MVP brevity, but we'd call fulfillment module)

      // 2. Send email to buyer
      // await sendEmail({
      //   to: order.email,
      //   subject: 'Vos produits numériques sont prêts !',
      //   template: 'digital-delivery',
      //   data: { items: digitalItems }
      // });
      
      logger.info({ order_id: order.id, digital_items: digitalItems.length }, 'Digital products delivered');
    }

  } catch (error) {
    logger.error({ err: error, order_id: data.id }, 'Digital fulfillment failed');
  }
}

export const config: SubscriberConfig = {
  event: ['order.placed'],
};
