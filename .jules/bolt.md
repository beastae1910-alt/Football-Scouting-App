## 2026-06-03 - Parallelizing Supabase queries
**Learning:** Independent Supabase queries can safely be parallelized using `Promise.all` to reduce network latency, since expected errors resolve as objects rather than throwing exceptions.
**Action:** Group independent `supabase` queries using `Promise.all`.
