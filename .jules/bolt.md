## 2024-06-19 - Parallelize independent Supabase queries
**Learning:** Independent Supabase database queries in React components can cause significant network latency when awaited sequentially. Since Supabase's JS client returns objects instead of throwing on errors, `Promise.all` handles them safely without short-circuiting.
**Action:** Always group independent `.select()` queries using `Promise.all` in dashboard data-fetching hooks to load statistics concurrently.
