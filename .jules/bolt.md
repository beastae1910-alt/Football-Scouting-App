## 2024-05-18 - Parallelize Supabase Queries
**Learning:** Independent Supabase queries in React components run sequentially by default, causing unnecessary waterfall network delays. Supabase returns `{data, error, count}` objects, so `Promise.all` won't short-circuit on database errors.
**Action:** Always group independent `.select()` queries using `Promise.all()` to minimize total latency and improve dashboard load times.
