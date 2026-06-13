## 2024-05-19 - Parallelize independent queries
**Learning:** React components (like `ScoutDashboard`) often fetch multiple independent datasets from Supabase sequentially (`await query1; await query2;`), which doubles network latency for component rendering.
**Action:** Always inspect sequential network requests within `useEffect` hooks and use `Promise.all` to fetch them in parallel when data dependencies permit.
