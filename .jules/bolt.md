
## 2025-06-25 - Supabase Query Waterfall Anti-Pattern
**Learning:** The codebase uses sequential `await supabase` calls for independent dashboard statistics. Because the Supabase JS client resolves with `{ data, error, count }` instead of throwing exceptions, parallelizing these queries with `Promise.all()` is safe from fail-fast short-circuiting.
**Action:** Parallelize independent Supabase queries using `Promise.all()` to eliminate network waterfalls and reduce load time.
