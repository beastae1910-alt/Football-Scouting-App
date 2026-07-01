## 2024-07-01 - Auth Bypass via user_metadata
**Vulnerability:** Authorization logic used a fallback to `user.user_metadata.role`, allowing clients to self-assign roles via `supabase.auth.updateUser`.
**Learning:** Relying on client-editable JWT metadata for authorization bypasses RLS and allows unauthorized role elevation.
**Prevention:** Authorization must rely strictly on secure, database-backed `profile` records protected by Row Level Security (RLS), not client-editable metadata.
