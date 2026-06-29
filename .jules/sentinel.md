## 2024-05-24 - Authorization Bypass via Client-Side User Metadata
**Vulnerability:** The application was using `supabase.auth.updateUser` on the client side to set `user_metadata.role`, and falling back to this value for authorization checks in `App.jsx`.
**Learning:** Client-side updates to `user_metadata` can be easily forged by malicious users, allowing them to bypass authorization checks.
**Prevention:** Always rely entirely on secure, database-backed roles protected by Row Level Security (RLS) instead of client-modifiable user metadata.
