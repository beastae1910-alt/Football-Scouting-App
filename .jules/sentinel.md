## 2024-06-25 - Insecure File Generation
**Vulnerability:** Predictable file names using Math.random().
**Learning:** Math.random() is cryptographically insecure and predictable.
**Prevention:** Use crypto.randomUUID() instead.
