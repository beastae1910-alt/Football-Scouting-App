## 2026-06-09 - Parallelizing Supabase Queries
**Learning:** In the Supabase JavaScript client, queries resolve with an object containing { data, error, count } rather than throwing exceptions, making them safe for Promise.all().
**Action:** Group independent database/Supabase queries in React components using Promise.all to minimize network latency and improve load times.
