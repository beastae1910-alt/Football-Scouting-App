
## 2024-05-14 - Parallelizing Independent Supabase Queries
**Learning:** In the React components used across this application (e.g. `PlayerDashboard`), multiple independent Supabase data queries are often requested sequentially using multiple `await` statements (creating a waterfall request chain), which increases overall dashboard load time unnecessarily.
**Action:** When fetching independent data from multiple Supabase tables inside `useEffect` or other data-fetching hooks, always parallelize the network requests using `Promise.all` to reduce network latency and load time.
