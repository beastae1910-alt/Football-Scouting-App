## 2024-10-24 - Fix Client-Side Authorization Bypass
**Vulnerability:** The application fell back to `user.user_metadata.role` for authorization logic. Because `user_metadata` can be updated client-side via `supabase.auth.updateUser`, a malicious user could bypass role restrictions and elevate privileges.
**Learning:** Client-provided metadata should never be trusted for authorization, as it can be modified from the browser console.
**Prevention:** Always rely solely on securely fetched, database-backed roles (e.g., `profile.role`) protected by Row Level Security (RLS).
