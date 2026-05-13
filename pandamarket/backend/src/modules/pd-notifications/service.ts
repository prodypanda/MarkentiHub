// pandamarket/backend/src/modules/pd-notifications/service.ts
import { MedusaService } from '@medusajs/framework/utils';
import Notification from './models/notification';

class PdNotificationService extends MedusaService({ Notification }) {
  /**
   * Create a new in-app notification
   */
  async notify(params: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }) {
    return this.createNotifications({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      data: params.data || {},
      is_read: false,
    });
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const notifications = await this.listNotifications({
      filters: { user_id: userId, is_read: false },
    });
    return notifications.length;
  }

  /**
   * Get notifications for a user (paginated)
   */
  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    return this.listNotifications({
      filters: { user_id: userId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const [notification] = await this.listNotifications({
      filters: { id: notificationId, user_id: userId },
    });

    if (notification) {
      await this.updateNotifications({
        id: notificationId,
        is_read: true,
      });
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    const unread = await this.listNotifications({
      filters: { user_id: userId, is_read: false },
    });

    if (unread.length > 0) {
      // Use Medusa's bulk update capabilities to fix N+1 queries
      await this.updateNotifications(
        unread.map((notification) => ({
          id: notification.id,
          is_read: true,
        }))
      );
    }
  }
}

export default PdNotificationService;
