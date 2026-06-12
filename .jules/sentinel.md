## 2024-06-12 - Fix Authorization Bypass via user_metadata
**Vulnerability:** The application was falling back to user_metadata for roles, allowing users to alter user_metadata directly via client-side requests to bypass authorization.
**Learning:** Never rely on client-modifiable metadata for authorization boundaries. Authorization must depend exclusively on securely fetched, database-backed roles.
**Prevention:** Avoid allowing or referencing client-side metadata updates for sensitive claims like roles.
