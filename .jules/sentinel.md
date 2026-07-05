## 2025-02-14 - Fix Auth Bypass in Role Selection
**Vulnerability:** Client-side role updates via `supabase.auth.updateUser` were used for authorization, allowing users to arbitrarily grant themselves scout privileges.
**Learning:** Supabase `updateUser` is client-controlled and modifies `user_metadata` directly. Relying on this metadata for frontend authorization (e.g., `user.user_metadata.role`) or backend RLS policies is inherently insecure.
**Prevention:** Always authorize based on a protected database table (e.g., `profiles.role`) queried on-demand or securely joined, ensuring that role updates happen only server-side or via secure API handlers rather than client-driven calls.
