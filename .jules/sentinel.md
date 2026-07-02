## 2024-05-24 - [Authorization Bypass via user_metadata]
**Vulnerability:** Authorization logic falls back to `user.user_metadata.role`, allowing users to bypass database authorization checks by updating their role directly via `supabase.auth.updateUser`.
**Learning:** Client-side updates to JWT metadata (`user_metadata`) are inherently untrustworthy for authorization purposes because the client can arbitrarily modify them.
**Prevention:** Always rely strictly on securely fetched, database-backed properties (e.g., a `profiles` table guarded by RLS) for authorization logic, avoiding fallback to client-modifiable fields.
