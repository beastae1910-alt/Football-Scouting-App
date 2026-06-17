## 2024-06-17 - Parallelize Supabase Queries
**Learning:** Supabase JS queries resolve with `{ data, error, count }` instead of throwing exceptions on failure. This makes `Promise.all` safe to use without fear of one query's expected error short-circuiting the others.
**Action:** Always group independent Supabase queries using `Promise.all` in React components (like dashboards) to avoid network waterfall latency.
