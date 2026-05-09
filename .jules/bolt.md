## 2024-05-18 - Promise.all Database Queries
**Learning:** Sequential Supabase database calls inside React `useEffect` hooks create network waterfalls, negatively impacting load times.
**Action:** Always parallelize independent Supabase queries using `Promise.all` in dashboard and view components.
