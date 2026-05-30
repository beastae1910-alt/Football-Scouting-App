
## 2026-05-30 - Insecure Filename Generation
**Vulnerability:** Weak random string generation via `Math.random()` for generating file upload identifiers.
**Learning:** Using `Math.random()` is not cryptographically secure and can result in predictable outcomes or collisions when generating filenames.
**Prevention:** Use `crypto.randomUUID()` or another secure entropy source (like `crypto.getRandomValues()`) for creating unpredictable, collision-resistant string identifiers.
