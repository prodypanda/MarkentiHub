// pandamarket/backend/src/api/routes/pd/notifications/route.ts
// =============================================================================
// PandaMarket — Notification Routes
// GET  /api/pd/notifications             → List notifications (paginated)
// GET  /api/pd/notifications/unread-count → Get unread count
// PUT  /api/pd/notifications/read-all    → Mark all as read
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

import { requireStoreContext } from '../../../middlewares/auth-context';
import { PdForbiddenError } from '../../../../utils/errors';

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

  const page = parsePositiveInt(req.query.page, 1, 10_000);
  const limit = parsePositiveInt(req.query.limit, 20, 100);

  // Check for special sub-routes via query
  const action = firstQueryValue(req.query.action);

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
