import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';

import { PdStoreNotFoundError, PdValidationError } from '../../../../../utils/errors';

const resolveQuerySchema = z.object({
  hostname: z.string().trim().min(1).max(253),
});

interface StoreLike {
  id: string;
  name?: string | null;
  subdomain?: string | null;
  custom_domain?: string | null;
  theme_id?: string | null;
  status?: string | null;
  is_verified?: boolean | null;
  settings?: Record<string, unknown> | null;
  logo_url?: string | null;
  category?: string | null;
}

interface IPdStoreService {
  resolveHostname(hostname: string): Promise<string | null>;
  listPdStores(args: { filters: { id: string } }): Promise<StoreLike[]>;
}

function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }
  return typeof value === 'string' ? value : undefined;
}

function validationFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  error.issues.forEach((issue) => {
    fields[issue.path.join('.')] = issue.message;
  });
  return fields;
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const parsed = resolveQuerySchema.safeParse({
    hostname: firstQueryValue(req.query.hostname),
  });
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }
  const { hostname } = parsed.data;

  const pdStoreService = req.scope.resolve<IPdStoreService>('pdStoreService');
  const storeId = await pdStoreService.resolveHostname(hostname);
  if (!storeId) {
    throw new PdStoreNotFoundError(hostname);
  }

  const [store] = await pdStoreService.listPdStores({ filters: { id: storeId } });
  if (!store) {
    throw new PdStoreNotFoundError(storeId);
  }

  res.json({
    store: {
      id: store.id,
      name: store.name,
      subdomain: store.subdomain,
      custom_domain: store.custom_domain,
      theme_id: store.theme_id,
      status: store.status,
      is_verified: store.is_verified,
      settings: store.settings,
      logo_url: store.logo_url,
      category: store.category,
    },
  });
}
