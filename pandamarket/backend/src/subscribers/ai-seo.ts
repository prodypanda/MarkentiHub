import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';
import { notifyVendor } from '../utils/websocket';

export default async function aiSeoSubscriber({
  event: { data },
  container,
}: SubscriberArgs<{ product_id: string; store_id: string }>) {
  const { product_id, store_id } = data;

  const productModuleService = container.resolve(Modules.PRODUCT);
  
  try {
    const product = await productModuleService.retrieveProduct(product_id);
    if (!product) return;

    // 1. Call Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    let seoTitle = `${product.title} - Quality Guaranteed`;
    let seoDescription = `Discover the best ${product.title}. ${product.description}`;

    if (geminiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Act as an expert e-commerce SEO copywriter. Generate a high-converting SEO Title (max 60 chars) and a compelling SEO Meta Description (max 160 chars) for the following product: 
Title: ${product.title}
Description: ${product.description || 'A great product.'}

Respond in the following JSON format ONLY, nothing else:
{"title": "your title", "description": "your description"}`
            }]
          }]
        })
      });

      if (response.ok) {
        const result: any = await response.json();
        try {
          const content = result.candidates[0].content.parts[0].text;
          const parsed = JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
          seoTitle = parsed.title;
          seoDescription = parsed.description;
        } catch (parseError) {
          console.error('Failed to parse Gemini output:', parseError);
        }
      } else {
        console.error('Gemini API Error:', await response.text());
      }
    } else {
      // Mock delay if no key is provided (for local testing)
      await new Promise(r => setTimeout(r, 2000));
    }

    // 2. Update the product with SEO metadata
    await productModuleService.updateProducts(product_id, {
      metadata: {
        ...(product.metadata as Record<string, any> || {}),
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_generated_at: new Date().toISOString(),
      }
    });

    // 3. Emit real-time WebSocket notification to the vendor
    notifyVendor(store_id, 'SEO_COMPLETE', { product_id, seoTitle, seoDescription });
    console.log(`[AI Worker] SEO generated for product ${product_id}`);

  } catch (error) {
    console.error('[AI Worker] SEO Generation failed:', error);
    // In a robust system, refund the token here
  }
}

export const config: SubscriberConfig = {
  event: ['ai.seo.requested'],
};
