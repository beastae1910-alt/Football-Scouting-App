## 2024-06-16 - Supabase Promise.all Error Handling
**Learning:** In the Supabase JavaScript client, queries resolve with an object containing { data, error, count } rather than throwing exceptions. This makes grouping them in Promise.all() safe from short-circuiting due to expected database query errors.
**Action:** Always parallelize independent database/Supabase queries in React components using Promise.all to minimize network latency and improve dashboard load times.
