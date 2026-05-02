import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';
// import { sendEmail } from '../utils/email';

export default async function digitalFulfillmentSubscriber({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderModuleService = container.resolve(Modules.ORDER);
  const productModuleService = container.resolve(Modules.PRODUCT);

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
      const isDigital = (product.metadata as Record<string, any>)?.is_digital;

      if (isDigital) {
        // Generate a token for the download
        const downloadToken = 'valid_purchase_token'; // Mock token for MVP
        const downloadUrl = `${process.env.PD_STORE_CORS}/api/pd/digital/${product_id}/download?token=${downloadToken}`;
        
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
      
      console.log(`[Digital Fulfillment] Delivered ${digitalItems.length} digital products for order ${order.id}`);
    }

  } catch (error) {
    console.error('[Digital Fulfillment Error]', error);
  }
}

export const config: SubscriberConfig = {
  event: ['order.placed'],
};
