## 2024-07-06 - Parallelizing Supabase Queries
**Learning:** Supabase JS client resolves queries with objects containing error properties rather than throwing exceptions. This prevents Promise.all() from short-circuiting when one query fails, making it perfectly safe to parallelize multiple independent database calls without try-catch blocks for individual promises.
**Action:** Always use Promise.all() for sequential independent Supabase queries to reduce network roundtrips.
