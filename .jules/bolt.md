## 2025-10-24 - Parallelizing Supabase Queries
**Learning:** In the Supabase JavaScript client, queries resolve with an object containing `{ data, error, count }` rather than throwing exceptions, making `Promise.all()` safe from short-circuiting. Sequential fetching causes unnecessary network latency waterfalls on dashboard load.
**Action:** Always parallelize independent `supabase.from(...)` queries with `Promise.all` to improve load times.
