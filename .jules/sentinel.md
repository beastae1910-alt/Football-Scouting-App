## 2024-05-18 - Client-side modification of user_metadata
**Vulnerability:** Authorization relies on `user_metadata.role` (which can be modified client-side via `supabase.auth.updateUser`) instead of solely on the securely fetched, database-backed `profile.role`.
**Learning:** In Supabase, `user_metadata` in the session can be updated directly from the client. Using it as a fallback for authorization logic allows an attacker to bypass role-based checks.
**Prevention:** Authorization logic must rely solely on the securely fetched, database-backed `profile.role` (protected by RLS). Do not fall back to or allow client-side modification of `user.user_metadata.role` to prevent authorization bypass vulnerabilities.
