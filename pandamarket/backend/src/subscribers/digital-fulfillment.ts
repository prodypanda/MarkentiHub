import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';
import jwt from 'jsonwebtoken';
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/subscribers/digital-fulfillment.ts
=======
import { z } from 'zod';
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/subscribers/digital-fulfillment.ts
// import { sendEmail } from '../utils/email';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('DigitalFulfillmentSubscriber');

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/subscribers/digital-fulfillment.ts
=======
const orderEventSchema = z.object({
  id: z.string().trim().min(1).max(128),
});

const productIdSchema = z.string().trim().min(1).max(128);
const buyerSubjectSchema = z.string().trim().min(1).max(255);

>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/subscribers/digital-fulfillment.ts
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

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/subscribers/digital-fulfillment.ts
=======
interface DigitalDeliveryItem {
  title?: string | null;
  url: string;
}

>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/subscribers/digital-fulfillment.ts
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
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/subscribers/digital-fulfillment.ts
    process.env.NEXT_PUBLIC_MEDUSA_URL ??
    process.env.PD_STORE_CORS?.split(',')[0];
  if (!baseUrl) {
    throw new Error('PD_PUBLIC_API_URL or NEXT_PUBLIC_MEDUSA_URL must be set for digital delivery links');
  }
  return baseUrl.replace(/\/$/, '');
=======
    process.env.NEXT_PUBLIC_MEDUSA_URL;
  if (baseUrl) {
    return baseUrl.replace(/\/$/, '');
  }
  if (process.env.PD_NODE_ENV === 'production') {
    throw new Error('PD_PUBLIC_API_URL or NEXT_PUBLIC_MEDUSA_URL must be set for digital delivery links in production');
  }
  const devBaseUrl = process.env.PD_STORE_CORS?.split(',')[0];
  if (!devBaseUrl) {
    throw new Error('PD_PUBLIC_API_URL or NEXT_PUBLIC_MEDUSA_URL must be set for digital delivery links');
  }
  return devBaseUrl.replace(/\/$/, '');
}

function isDigitalProduct(product: ProductLike): boolean {
  return product.metadata?.is_digital === true;
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/subscribers/digital-fulfillment.ts
}

export default async function digitalFulfillmentSubscriber({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/subscribers/digital-fulfillment.ts
=======
  const parsedEvent = orderEventSchema.safeParse(data);
  if (!parsedEvent.success) {
    logger.error({ issues: parsedEvent.error.issues }, 'Invalid order event payload for digital fulfillment');
    return;
  }

>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/subscribers/digital-fulfillment.ts
  const orderModuleService = container.resolve(Modules.ORDER) as unknown as IOrderModuleService;
  const productModuleService = container.resolve(Modules.PRODUCT) as unknown as IProductModuleService;

  try {
    const order = await orderModuleService.retrieveOrder(parsedEvent.data.id, {
      relations: ['items'],
    });

    if (!order || !order.items) return;

    const digitalItems: DigitalDeliveryItem[] = [];

    for (const item of order.items) {
      // Find the product
      const parsedProductId = productIdSchema.safeParse(item.product_id);
      if (!parsedProductId.success) continue;
      const product_id = parsedProductId.data;

      const product = await productModuleService.retrieveProduct(product_id);
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/subscribers/digital-fulfillment.ts
      const isDigital = product.metadata?.is_digital;

      if (isDigital) {
        // Generate a token for the download
        const downloadToken = jwt.sign(
          {
            sub: order.customer_id ?? order.email ?? order.id,
=======

      if (isDigitalProduct(product)) {
        const parsedSubject = buyerSubjectSchema.safeParse(order.customer_id ?? order.email ?? order.id);
        if (!parsedSubject.success) {
          logger.error({ order_id: order.id, product_id }, 'Cannot generate digital download token without buyer subject');
          continue;
        }

        const downloadToken = jwt.sign(
          {
            sub: parsedSubject.data,
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/subscribers/digital-fulfillment.ts
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
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/subscribers/digital-fulfillment.ts
    logger.error({ err: error, order_id: data.id }, 'Digital fulfillment failed');
=======
    logger.error({ err: error, order_id: parsedEvent.data.id }, 'Digital fulfillment failed');
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/subscribers/digital-fulfillment.ts
  }
}

export const config: SubscriberConfig = {
  event: ['order.placed'],
};
