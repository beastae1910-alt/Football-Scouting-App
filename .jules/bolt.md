## 2024-05-30 - Parallelizing Supabase Queries

**Learning:** Independent `await supabase...` data fetching queries within `useEffect` hooks create unnecessary sequential network waterfalls, leading to noticeable UI loading delays, especially on initial component mount like dashboard loads.
**Action:** Always scan for sequential, independent database queries and replace them with `Promise.all()`. Supabase queries resolve gracefully with objects (e.g., `{ data, error }`), avoiding the short-circuiting risk inherent in traditional Promise.all error throws.
