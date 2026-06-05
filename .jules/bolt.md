## 2024-05-24 - Parallelizing Supabase Queries
**Learning:** In the Supabase JavaScript client, queries resolve with an object containing `{ data, error, count }` rather than throwing exceptions, making them safe to group in `Promise.all()` without short-circuiting. Independent Supabase queries should be parallelized to minimize network latency.
**Action:** When making multiple independent database queries, parallelize them using `Promise.all` rather than awaiting them sequentially.
