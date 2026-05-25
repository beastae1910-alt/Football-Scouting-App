## 2024-05-25 - Parallelize Independent Supabase Queries
**Learning:** Sequential data fetching with Supabase in React `useEffect` hooks (e.g., awaiting multiple independent `.from().select()` calls) creates a network waterfall, unnecessarily blocking component rendering and state updates.
**Action:** Always group independent Supabase queries using `Promise.all` to fetch data concurrently, reducing total network latency to the duration of the slowest query rather than the sum of all queries.
