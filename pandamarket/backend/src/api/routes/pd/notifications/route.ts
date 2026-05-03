// pandamarket/backend/src/api/routes/pd/notifications/route.ts
// =============================================================================
// PandaMarket — Notification Routes
// GET  /api/pd/notifications             → List notifications (paginated)
// GET  /api/pd/notifications/unread-count → Get unread count
// PUT  /api/pd/notifications/read-all    → Mark all as read
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/notifications/route.ts

import { requireStoreContext } from '../../../middlewares/auth-context';
import { PdForbiddenError } from '../../../../utils/errors';
=======
import { z } from 'zod';

import { requireStoreContext } from '../../../middlewares/auth-context';
import { PdForbiddenError, PdValidationError } from '../../../../utils/errors';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  action: z.enum(['unread-count']).optional(),
});

interface IPdNotificationService {
  getUnreadCount(userId: string): Promise<number>;
  getUserNotifications(userId: string, page: number, limit: number): Promise<unknown[]>;
  markAllAsRead(userId: string): Promise<void>;
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
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/notifications/route.ts

interface IPdNotificationService {
  getUnreadCount(userId: string): Promise<number>;
  getUserNotifications(userId: string, page: number, limit: number): Promise<unknown[]>;
  markAllAsRead(userId: string): Promise<void>;
}

function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }
  return typeof value === 'string' ? value : undefined;
}

function parsePositiveInt(value: unknown, fallback: number, max: number): number {
  const parsed = Number.parseInt(firstQueryValue(value) ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.min(parsed, max);
}

/**
 * GET /api/pd/notifications
 * List notifications for the authenticated user
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const { userId } = requireStoreContext(req);
  if (!userId) throw new PdForbiddenError();

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/notifications/route.ts
  const page = parsePositiveInt(req.query.page, 1, 10_000);
  const limit = parsePositiveInt(req.query.limit, 20, 100);

  // Check for special sub-routes via query
  const action = firstQueryValue(req.query.action);
=======
  const parsed = querySchema.safeParse({
    page: firstQueryValue(req.query.page) ?? undefined,
    limit: firstQueryValue(req.query.limit) ?? undefined,
    action: firstQueryValue(req.query.action),
  });
  if (!parsed.success) {
    throw new PdValidationError('Données invalides', {
      fields: validationFields(parsed.error),
    });
  }
  const { page, limit, action } = parsed.data;
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/notifications/route.ts

  const pdNotificationService = req.scope.resolve<IPdNotificationService>('pdNotificationService');
  if (action === 'unread-count') {
    const count = await pdNotificationService.getUnreadCount(userId);
    res.json({ unread_count: count });
    return;
  }

  const notifications = await pdNotificationService.getUserNotifications(userId, page, limit);

  res.json({ notifications, page, limit });
}

/**
 * PUT /api/pd/notifications
 * Mark all notifications as read
 */
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const { userId } = requireStoreContext(req);
  if (!userId) throw new PdForbiddenError();

  const pdNotificationService = req.scope.resolve<IPdNotificationService>('pdNotificationService');
  await pdNotificationService.markAllAsRead(userId);

  res.json({ success: true, message: 'Toutes les notifications ont été marquées comme lues' });
}
