import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const storeId = (req as any).pd_store_id as string || 'store_123';

  const productModuleService = req.scope.resolve(Modules.PRODUCT);

  const products = await productModuleService.listProducts({
    // @ts-ignore
    "metadata.store_id": storeId,
  });

  // Simple CSV Generation
  const headers = ['ID', 'Title', 'Description', 'Status', 'Is Digital'];
  const rows = products.map((p: any) => {
    return [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      p.status,
      p.metadata?.is_digital ? 'TRUE' : 'FALSE'
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="pandamarket_products_${storeId}.csv"`);
  res.send(csvContent);
};
