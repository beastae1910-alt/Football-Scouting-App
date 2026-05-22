## 2026-05-22 - Parallelizing Supabase Queries
**Learning:** Sequential Supabase queries in useEffect hooks create a waterfall effect, significantly slowing down initial component render.
**Action:** Always identify independent Supabase queries (e.g., fetching multiple view counts or lists) and wrap them in `Promise.all` to fetch them concurrently.
