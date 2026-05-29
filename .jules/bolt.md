## 2026-05-29 - Parallelize Supabase Queries
**Learning:** Supabase queries resolve with an object ({ data, error, count }) instead of throwing exceptions, making them safe to group in Promise.all() without short-circuiting on expected database query errors.
**Action:** Use Promise.all() to run independent Supabase queries in parallel to minimize network latency and improve dashboard load times.
