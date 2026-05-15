## 2024-06-19 - Parallelizing Supabase Queries
**Learning:** React components (like PlayerDashboard) with multiple independent database calls to Supabase often execute them sequentially, adding unnecessary cumulative latency.
**Action:** Always scan `useEffect` hooks for sequential `await supabase...` queries that don't depend on each other and combine them using `Promise.all` to optimize dashboard/component load times.
