## 2024-05-24 - Replace Math.random() with secure token generation
**Vulnerability:** Weak pseudo-random number generator (`Math.random()`) used for generating file names.
**Learning:** This repo lacked strict guidelines for using secure random strings. `Math.random()` should be avoided for identifying or token-related functions, as it is predictable.
**Prevention:** Use `crypto.randomUUID()` to generate unguessable, collision-resistant random identifiers.
