## 2024-05-24 - Parallelize independent Supabase queries
**Learning:** Independent Supabase queries in React components cause unnecessary sequential network latency and block rendering.
**Action:** Always parallelize independent database queries in useEffect hooks using Promise.all to minimize network bottlenecks and improve dashboard load times.
