## 2024-06-17 - Client-Side Privilege Escalation
**Vulnerability:** The app allowed users to update their own role via supabase.auth.updateUser and trusted user.user_metadata.role for authorization.
**Learning:** Supabase allows users to update their own user_metadata from the client by default. Relying on it for authorization allows trivial privilege escalation.
**Prevention:** Rely entirely on securely fetched, database-backed roles protected by proper Row Level Security (RLS).
