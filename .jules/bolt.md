## 2024-05-24 - Parallelize Supabase Queries
**Learning:** Supabase queries in React components are often written sequentially, leading to unnecessary network latency. The `supabase` JS client resolves queries with an object containing `{ data, error, count }` instead of throwing exceptions.
**Action:** Always group independent Supabase queries into a `Promise.all` block to fetch data concurrently. Because the client returns errors rather than throwing them, `Promise.all` is safe to use without risk of short-circuiting due to a single failed query.
