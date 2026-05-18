## 2024-05-18 - Avoid network waterfalls by using Promise.all
**Learning:** The PlayerDashboard and ScoutDashboard components had sequential await calls to Supabase, which caused unnecessary network waterfalls delaying data load.
**Action:** Parallelize independent Supabase calls using Promise.all.
