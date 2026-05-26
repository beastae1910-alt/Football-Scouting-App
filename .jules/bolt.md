## 2024-05-19 - Parallelize Dashboard Supabase Queries
**Learning:** Independent Supabase queries in React components (`PlayerDashboard.jsx` and `ScoutDashboard.jsx`) cause network waterfall latency when executed sequentially.
**Action:** Use `Promise.all` to fetch these queries concurrently, speeding up dashboard load times and avoiding sequential awaiting.
