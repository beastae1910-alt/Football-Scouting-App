## 2024-05-24 - Insecure Random Number Generation
**Vulnerability:** Used `Math.random()` to generate a "collision-resistant" file name for video uploads. `Math.random()` is not cryptographically secure and can lead to predictable patterns or potential collisions if used concurrently across sessions.
**Learning:** `Math.random()` was used for a security-sensitive generation task when UUIDs or securely generated strings were required.
**Prevention:** Always use cryptographically secure random number generation (e.g., `crypto.randomUUID()`, `crypto.getRandomValues()`) for identifiers, keys, or filenames where unpredictability and collision resistance are required.
