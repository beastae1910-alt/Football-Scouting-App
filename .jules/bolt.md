
## 2024-05-24 - Supabase Query Parallelization
**Learning:** Supabase JavaScript client queries resolve with `{ data, error, count }` rather than throwing exceptions, making them safe to group in `Promise.all()` without short-circuiting due to expected database query errors. Sequential queries in dashboards create unnecessary network waterfall latency.
**Action:** Always parallelize independent Supabase queries (e.g., in dashboards) using `Promise.all` to improve load times, as the error handling can still be done safely after all promises resolve.
