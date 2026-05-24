## 2024-05-24 - Insecure random number generation for file names
**Vulnerability:** Weak random string generation using Math.random() for uploaded file names.
**Learning:** Math.random() is not cryptographically secure and can lead to predictable file names, which could allow file enumeration or overwriting.
**Prevention:** Always use crypto.randomUUID() or the Web Crypto API to generate secure, collision-resistant unique identifiers.
