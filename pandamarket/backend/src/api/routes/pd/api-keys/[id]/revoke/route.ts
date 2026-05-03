// pandamarket/backend/src/api/routes/pd/api-keys/[id]/revoke/route.ts
// =============================================================================
// PandaMarket — Revoke a vendor API key (soft-delete).
// POST /api/pd/api-keys/:id/revoke   → requires JWT vendor auth + ownership.
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/api-keys/[id]/revoke/route.ts

import { requireStoreContext } from '../../../../../middlewares/auth-context';
import { PdNotFoundError, PdNotOwnerError } from '../../../../../../utils/errors';
=======
import { z } from 'zod';

import { requireStoreContext } from '../../../../../middlewares/auth-context';
import { PdNotFoundError, PdNotOwnerError, PdValidationError } from '../../../../../../utils/errors';

const paramsSchema = z.object({
  id: z.string().trim().min(1).max(128),
});

function validationFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  error.issues.forEach((issue) => {
    fields[issue.path.join('.')] = issue.message;
  });
  return fields;
}

function getKeyId(req: MedusaRequest): string {
  const parsed = paramsSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }
  return parsed.data.id;
}
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/api-keys/[id]/revoke/route.ts

interface ApiKeyRecord {
  id: string;
  store_id: string;
}

interface IPdApiKeyService {
  listApiKeys(args: { filters: { id: string } }): Promise<ApiKeyRecord[]>;
  revokeKey(keyId: string, storeId: string): Promise<void>;
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const { storeId } = requireStoreContext(req);
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/api-keys/[id]/revoke/route.ts
  const keyId = req.params.id;
=======
  const keyId = getKeyId(req);
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/api-keys/[id]/revoke/route.ts

  const apiKeyService = req.scope.resolve<IPdApiKeyService>('pdApiKeyService');
  const [key] = await apiKeyService.listApiKeys({ filters: { id: keyId } });
  if (!key) throw new PdNotFoundError('Clé API');
  if (key.store_id !== storeId) throw new PdNotOwnerError(keyId);

  await apiKeyService.revokeKey(keyId, storeId);
  res.json({ success: true, message: 'Clé API révoquée' });
};
