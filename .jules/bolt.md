## 2024-05-18 - Parallelizing Independent Supabase Queries in React Components
**Learning:** Sequential database queries inside `useEffect` block each other and cause unnecessary network latency. Supabase queries in React components (like dashboard metrics fetches) are often independent and should be executed concurrently.
**Action:** Always group independent Supabase read/count operations into a `Promise.all` array to minimize load times.
