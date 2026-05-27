## 2026-05-27 - Secure File Name Generation
**Vulnerability:** Weak random number generation using Math.random() for file names.
**Learning:** Math.random() is cryptographically insecure and predictable, risking filename collisions or prediction.
**Prevention:** Use crypto.randomUUID() for generating unpredictable, collision-resistant string identifiers.
