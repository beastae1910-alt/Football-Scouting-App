
## 2025-06-19 - Insecure Authorization via user_metadata Fallback
**Vulnerability:** Authorization logic was falling back to `user.user_metadata.role`, which could be updated client-side via `supabase.auth.updateUser()`, allowing users to bypass role restrictions.
**Learning:** `user_metadata` is often considered untrusted and can be modified directly by the authenticated user if RLS on profiles is the only secure boundary.
**Prevention:** Authorization logic must rely solely on securely fetched, database-backed `profile.role` (protected by RLS). Do not fall back to or allow client-side modification of `user_metadata.role`.
