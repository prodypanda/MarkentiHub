## 2024-05-14 - [MedusaJS Bulk Operations]
**Learning:** MedusaService auto-generated CRUD methods (like `updateNotifications`) support bulk operations by passing an array of objects. Iterating over records and calling `updateNotifications` individually causes N+1 query problems.
**Action:** Use bulk operations by passing an array of objects to MedusaService update methods when modifying multiple records simultaneously.
