## 2026-05-13 - [MedusaJS N+1 Query Optimization in Subscribers]
**Learning:** In MedusaJS, fetching single entities in loops (e.g., `listPdStores({ filters: { id: storeId } })`) inside event subscribers can cause severe N+1 database queries. Passing an array of IDs to MedusaJS filters acts as an implicit `$in` operator, avoiding the N+1 issue.
**Action:** When looping over IDs in a MedusaJS subscriber or service, use a batched array map to fetch all required entities upfront: `listPdStores({ filters: { id: Array.from(storeIds) as any } })`.
