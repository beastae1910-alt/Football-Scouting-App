## 2024-05-27 - Supabase Query Parallelization
**Learning:** Supabase JavaScript client resolves queries with an object containing `{ data, error, count }` instead of throwing exceptions on database errors. This makes it perfectly safe to group independent queries using `Promise.all()` without risk of one failed query short-circuiting the entire batch.
**Action:** Always parallelize independent database/Supabase queries in React components (e.g., dashboard initialization) using `Promise.all()` to minimize network waterfall and improve load times.
