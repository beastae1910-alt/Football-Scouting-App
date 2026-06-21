## 2024-05-19 - Use Promise.all for independent queries
**Learning:** In React components like `PlayerDashboard` and `ScoutDashboard`, independent database queries to Supabase are run sequentially using `await` inside a `useEffect`. This creates an N+1 query problem, increasing network latency and delaying component rendering.
**Action:** Always group independent async Supabase queries using `Promise.all` to execute them concurrently, reducing total wait time to the duration of the longest query.
