## 2024-05-14 - Parallelize independent queries
**Learning:** Sequential await statements for independent queries (like getting counts from different tables) unnecessarily blocks network requests, increasing overall load time.
**Action:** Use `Promise.all` to run independent Supabase queries concurrently. This reduces total latency to the duration of the longest single query.
