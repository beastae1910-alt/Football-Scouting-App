## 2024-05-18 - Parallelize Independent Database Queries in Dashboards
**Learning:** In React components like dashboards where data hydration requires fetching multiple independent aggregates (e.g., views, appearances, interests), fetching them sequentially causes unnecessary network latency.
**Action:** Always group independent Supabase `select` calls using `Promise.all()` to fetch them concurrently and minimize load time.
