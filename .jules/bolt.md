## 2026-05-31 - Parallelize Supabase queries
**Learning:** Sequential Supabase queries in React useEffects cause unnecessary network latency and delay dashboard rendering.
**Action:** Always group independent queries using Promise.all to minimize waterfall loading.
