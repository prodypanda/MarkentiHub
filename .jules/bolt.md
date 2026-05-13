## 2026-05-13 - [MedusaJS Bulk Operations Support]
**Learning:** MedusaJS V2's `MedusaService` base class supports auto-generated CRUD bulk operations natively. When updating multiple entities, we can avoid N+1 issues by passing an array of update objects (e.g., `updateNotifications([{id: "1", ...}, {id: "2", ...}])`) instead of looping through items sequentially.
**Action:** Always search for sequential iteration over array items when making DB updates in services inherited from `MedusaService`. Replace loops with single bulk calls passing object arrays.
