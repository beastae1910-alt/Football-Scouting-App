## 2024-05-13 - Parallelize Supabase Queries
**Learning:** Sequential await calls on independent Supabase queries in dashboards introduce unnecessary network latency.
**Action:** Use Promise.all to parallelize independent database queries to reduce overall component load time.
