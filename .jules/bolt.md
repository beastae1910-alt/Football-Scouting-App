## 2024-05-28 - Supabase parallelization
**Learning:** Multiple independent database queries in React components are often executed sequentially, increasing load times.
**Action:** Use `Promise.all` with Supabase queries. Since Supabase JS client resolves queries with an object containing `{ data, error, count }` instead of throwing errors, grouping them in `Promise.all` is safe and prevents short-circuiting.
