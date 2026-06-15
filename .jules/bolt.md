
## 2024-03-24 - Parallelizing Supabase Queries with Promise.all
**Learning:** Independent database/Supabase queries in React components can be parallelized safely using `Promise.all` because the Supabase JavaScript client resolves with an object containing `{ data, error, count }` rather than throwing exceptions, preventing short-circuiting.
**Action:** Always look for opportunities to group independent Supabase queries in `Promise.all` to minimize network latency and improve component load times.
