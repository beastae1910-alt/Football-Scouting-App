## 2024-05-18 - Fix Authorization Bypass via user_metadata
**Vulnerability:** Authorization logic trusted user.user_metadata.role from the client.
**Learning:** Client-side updates to user_metadata can be manipulated by malicious users, bypassing RLS and gaining unauthorized roles.
**Prevention:** Always rely strictly on a securely fetched, database-backed profile role for authorization checks.
