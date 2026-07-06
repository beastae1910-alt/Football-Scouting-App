## 2024-05-18 - Auth Bypass via user_metadata
**Vulnerability:** Authorization relies on `user_metadata.role` client-side, which can be easily modified or spoofed, leading to auth bypass.
**Learning:** Relying on client-side state for authorization logic rather than a securely fetched, database-backed `profile.role` (protected by RLS) introduces critical vulnerabilities.
**Prevention:** Authorization logic must rely solely on securely fetched database information (e.g. `profile.role`). Do not fall back to or allow client-side modification of `user.user_metadata.role`.
