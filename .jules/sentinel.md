## 2024-07-08 - Authorization Bypass via user_metadata
**Vulnerability:** The application was falling back to `user.user_metadata.role` for authorization checks and allowed client-side modification of this data via `supabase.auth.updateUser()`.
**Learning:** In Supabase, `user_metadata` is controllable by the client and should never be used as a source of truth for authorization or role-based access control (RBAC). Only database-backed profiles protected by Row Level Security (RLS) should be trusted.
**Prevention:** Never use client-modifiable JWT claims or `user_metadata` for security decisions. Always fetch authoritative role data from a secure, RLS-protected database table (e.g., a `profiles` table).
