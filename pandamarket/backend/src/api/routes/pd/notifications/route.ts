// @ts-nocheck
// pandamarket/backend/src/api/routes/pd/notifications/route.ts
// =============================================================================
// PandaMarket — Notification Routes
// GET  /api/pd/notifications             → List notifications (paginated)
// GET  /api/pd/notifications/unread-count → Get unread count
// PUT  /api/pd/notifications/read-all    → Mark all as read
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PdForbiddenError } from '../../../../utils/errors';

/**
 * GET /api/pd/notifications
 * List notifications for the authenticated user
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const userId = (req as Record<string, unknown>).pd_user_id as string;
  if (!userId) throw new PdForbiddenError();

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  // Check for special sub-routes via query
  const action = req.query.action as string;

  if (action === 'unread-count') {
    const pdNotificationService = req.scope.resolve('pdNotificationService');
    const count = await pdNotificationService.getUnreadCount(userId);
    res.json({ unread_count: count });
    return;
  }

  const pdNotificationService = req.scope.resolve('pdNotificationService');
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
  const userId = (req as Record<string, unknown>).pd_user_id as string;
  if (!userId) throw new PdForbiddenError();

  const pdNotificationService = req.scope.resolve('pdNotificationService');
  await pdNotificationService.markAllAsRead(userId);

  res.json({ success: true, message: 'Toutes les notifications ont été marquées comme lues' });
}
