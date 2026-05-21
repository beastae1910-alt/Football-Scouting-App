## 2026-05-21 - Parallelize Independent Network Requests
**Learning:** React components often perform sequential API/Supabase calls (e.g., fetching views, search appearances, and interests one after another), which creates a network waterfall and increases load times significantly.
**Action:** Always group independent, non-dependent queries using `Promise.all` in frontend components. This minimizes network latency and improves perceived performance by fetching data concurrently.
