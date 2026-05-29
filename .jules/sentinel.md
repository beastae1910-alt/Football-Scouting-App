## 2026-05-29 - Weak Random Number Generation
**Vulnerability:** Weak random number generation using Math.random() for file names.
**Learning:** Math.random() is predictable and can lead to filename collisions or predictable URLs.
**Prevention:** Use crypto.randomUUID() for secure, collision-resistant string generation.
