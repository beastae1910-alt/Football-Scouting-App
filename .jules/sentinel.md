## 2024-05-24 - Fix predictable random string generation
**Vulnerability:** Filenames for uploaded files were generated using `Math.random()`, which is not cryptographically secure and can lead to predictable file names and identifiers.
**Learning:** `Math.random()` should not be used in contexts where uniqueness and unpredictability are required for security (e.g., generating tokens, IDs, or filenames).
**Prevention:** Always use a cryptographically secure pseudo-random number generator (CSPRNG). In web environments, `crypto.randomUUID()` or `crypto.getRandomValues()` should be used for generating secure random strings or IDs.
