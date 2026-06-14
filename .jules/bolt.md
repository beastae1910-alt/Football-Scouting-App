
## 2024-06-14 - Parallelize independent Supabase queries
**Learning:** Independent Supabase queries in the JS client resolve with { data, error, count } instead of throwing, so they do not short-circuit Promise.all() on typical database errors.
**Action:** Use Promise.all() for independent Supabase queries to reduce dashboard load latency without risking unhandled promise rejections on expected query errors.
