## 2026-06-07 - Parallelize Supabase Queries

**Learning:** In the Supabase JavaScript client, independent queries resolve to objects (`{ data, error, count }`) rather than throwing exceptions. This makes it completely safe and highly effective to group them inside `Promise.all()`. The execution continues even if one query encounters an expected database error, without short-circuiting the others.

**Action:** Always wrap independent, sequential Supabase queries in `Promise.all()` to minimize network round-trips and reduce latency, particularly in data-heavy components like dashboards.
