// pandamarket/backend/src/api/routes/pd/stores/[id]/route.ts
// =============================================================================
// PandaMarket — Store Detail Routes
// GET  /api/pd/stores/:id  → Get store details
// PUT  /api/pd/stores/:id  → Update store (owner only)
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';

import { requireStoreContext } from '../../../../middlewares/auth-context';
import { ShippingMode, SubscriptionPlan } from '../../../../../utils/constants';
import { PdStoreNotFoundError, PdNotOwnerError, PdValidationError } from '../../../../../utils/errors';

const paramsSchema = z.object({
  id: z.string().min(1),
});

const updateStoreSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().max(1000).nullable().optional(),
    subdomain: z.string().trim().min(3).max(63).regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/).optional(),
    custom_domain: z.string().trim().min(1).max(253).nullable().optional(),
    theme_id: z.string().trim().min(1).nullable().optional(),
    settings: z.record(z.unknown()).optional(),
    logo_url: z.string().url().nullable().optional(),
    favicon_url: z.string().url().nullable().optional(),
    category: z.string().trim().max(120).nullable().optional(),
    shipping_mode: z.nativeEnum(ShippingMode).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

interface StoreLike {
  id: string;
  name?: string | null;
  description?: string | null;
  subdomain?: string | null;
  custom_domain?: string | null;
  theme_id?: string | null;
  status?: string | null;
  is_verified?: boolean | null;
  subscription_plan?: SubscriptionPlan | null;
  settings?: Record<string, unknown> | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  category?: string | null;
  shipping_mode?: ShippingMode | null;
  created_at?: string | Date | null;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<StoreLike[]>;
  updatePdStores(input: { id: string } & Partial<StoreLike>): Promise<StoreLike>;
}

function validationFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  error.issues.forEach((issue) => {
    fields[issue.path.join('.')] = issue.message;
  });
  return fields;
}

function getRouteId(req: MedusaRequest): string {
  const params = req.params as { id?: string };
  const parsed = paramsSchema.safeParse({ id: params.id });
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }
  return parsed.data.id;
}

/**
 * GET /api/pd/stores/:id
 * Get store details (public — no auth required)
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const id = getRouteId(req);
  const pdStoreService = req.scope.resolve<IPdStoreService>('pdStoreService');

  const [store] = await pdStoreService.listPdStores({ filters: { id } });

  if (!store) {
    throw new PdStoreNotFoundError(id);
  }

  res.json({
    store: {
      id: store.id,
      name: store.name,
      description: store.description,
      subdomain: store.subdomain,
      custom_domain: store.custom_domain,
      theme_id: store.theme_id,
      status: store.status,
      is_verified: store.is_verified,
      subscription_plan: store.subscription_plan,
      settings: store.settings,
      logo_url: store.logo_url,
      favicon_url: store.favicon_url,
      category: store.category,
      shipping_mode: store.shipping_mode,
      created_at: store.created_at,
    },
  });
}

/**
 * PUT /api/pd/stores/:id
 * Update store details (owner only — must be authenticated)
 */
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const id = getRouteId(req);
  const { storeId } = requireStoreContext(req);
  const pdStoreService = req.scope.resolve<IPdStoreService>('pdStoreService');

  const [store] = await pdStoreService.listPdStores({ filters: { id } });

  if (!store) {
    throw new PdStoreNotFoundError(id);
  }

  // Tenant isolation: ensure the authenticated user owns this store
  if (store.id !== storeId) {
    throw new PdNotOwnerError(id);
  }

  const parsed = updateStoreSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }

  const updated = await pdStoreService.updatePdStores({
    id,
    ...parsed.data,
  });

  res.json({ store: updated });
}
