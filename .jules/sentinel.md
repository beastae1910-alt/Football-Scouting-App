## 2026-05-11 - Secure Random Identifier Generation
**Vulnerability:** Weak random number generator (`Math.random()`) was used for generating file names for user uploads, which can be somewhat predictable and potentially lead to collisions or predictability in a security context.
**Learning:** When generating unique identifiers for resources that are stored (like file names in cloud storage), a cryptographically secure pseudo-random number generator (CSPRNG) should be used instead of `Math.random()` to prevent collision risks and ensure identifier unguessability.
**Prevention:** Use `crypto.randomUUID()` or `crypto.getRandomValues()` to generate security-sensitive or collision-resistant random values.
