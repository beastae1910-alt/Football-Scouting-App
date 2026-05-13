## 2024-05-24 - Replace Math.random() with crypto.randomUUID()
**Vulnerability:** Weak randomness using Math.random() was used for file name generation.
**Learning:** Math.random() is predictable and can lead to naming collisions or potential enumeration risks, especially for user uploads.
**Prevention:** Always use Web Crypto API (e.g., crypto.randomUUID()) for secure identifier generation.
