## 2024-05-20 - [Performance] Fix N+1 query in notifications markAllAsRead
**Learning:** In `@medusajs/framework/utils` MedusaService modules, bulk updates are supported by passing an array of objects to the auto-generated CRUD methods (like `updateNotifications`). Iterating over records and calling `updateNotifications` individually causes unnecessary N+1 queries.
**Action:** Always prefer passing an array of updates to `update[Entity]` rather than wrapping it in a `for` loop.
