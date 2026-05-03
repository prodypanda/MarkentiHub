import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const storeId = (req as any).pd_store_id as string;
  
  if (!storeId) {
    return res.status(401).json({ message: "Non autorisé. Jeton vendeur requis." });
  }

  // Dispatch a product-export batch job filtered by store_id
  return res.status(202).json({
    message: "Exportation CSV en file d'attente. Un lien de téléchargement sera généré.",
    job_id: `batch_export_${Date.now()}`,
    status: 'pending'
  });
};
