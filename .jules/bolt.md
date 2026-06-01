## 2026-06-01 - Parallelizing Supabase Queries
**Learning:** Supabase queries resolve with an object containing data/error instead of throwing exceptions. This allows grouping them safely in Promise.all() without risking short-circuiting.
**Action:** Always use Promise.all for independent Supabase queries in React components.
