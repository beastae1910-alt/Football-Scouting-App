## 2024-06-20 - Parallelize Supabase Queries
**Learning:** Independent database queries returning `{ data, error }` (like in the Supabase JS client) can safely be parallelized using `Promise.all()` to reduce network waterfall latency because they do not throw errors that would short-circuit the execution.
**Action:** Always wrap independent, non-sequential queries in `Promise.all()` in React effect hooks to optimize initial data fetching load times.
