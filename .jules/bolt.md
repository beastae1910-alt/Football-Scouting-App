## 2024-05-24 - Parallelize independent queries to prevent waterfall effects
**Learning:** Sequential database queries in React components (e.g., fetching multiple separate metrics or views for a dashboard using `await` sequentially) cause a waterfall effect, significantly increasing load times and network latency.
**Action:** Always group independent Supabase or API queries into a single `Promise.all` array to execute them concurrently, resolving them together before updating state.
