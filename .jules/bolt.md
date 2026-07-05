## 2025-07-05 - Batching Supabase API Calls
**Learning:** Supabase JavaScript client queries resolve with an object instead of throwing exceptions, making `Promise.all` safe to group API calls without fear of short-circuiting.
**Action:** Replace sequential queries with `Promise.all` when fetching independent dashboard metrics to minimize network latency.
