## 2024-05-18 - Promise.all Optimization for Supabase count queries
**Learning:** In dashboards loading multiple independent counts or small datasets from Supabase, executing queries sequentially via await introduces a network waterfall that increases load times.
**Action:** When working on components that fetch independent sets of initial data, combine the queries into a single `Promise.all` execution to reduce the total network latency.
