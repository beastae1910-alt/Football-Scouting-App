## 2024-06-28 - Avoid user_metadata for authorization
**Vulnerability:** Authorization logic was falling back to the client-modifiable `user.user_metadata.role`.
**Learning:** `user_metadata` in Supabase can be updated arbitrarily by the client via `supabase.auth.updateUser()`. Using it for authorization allows users to elevate privileges.
**Prevention:** Always rely strictly on database-backed profile data protected by Row Level Security (RLS) for authorization checks.
