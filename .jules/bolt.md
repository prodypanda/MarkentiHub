## 2026-05-14 - N+1 in MarkAllAsRead
**Learning:** `markAllAsRead` currently iterates through every unread notification one-by-one to update it to `is_read: true`. This causes an N+1 query issue for bulk updates.
**Action:** Use MedusaJS auto-generated bulk operations for modules extending `MedusaService` by passing an array of update objects to `updateNotifications`.
