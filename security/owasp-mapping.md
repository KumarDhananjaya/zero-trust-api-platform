# OWASP Top 10 Mapping

| OWASP Category | ZTSAP Feature / Mitigation |
| :--- | :--- |
| **A01: Broken Access Control** | **Core Feature**: Centralized Policy Engine (ABAC/RBAC). PolicyGuard enforces authz on every request. |
| **A02: Cryptographic Failures** | using `bcrypt` for passwords. JWTs signed with strong secrets. HTTPS (assumed LB termination). |
| **A03: Injection** | **Prisma ORM** prevents SQL injection by default. Input validation via DTOs. |
| **A04: Insecure Design** | **Zero-Trust Architecture**: "Never trust, always verify". |
| **A05: Security Misconfiguration** | Dockerized environment ensures consistent config. Secrets managed via `.env`. |
| **A06: Vuln. & Outdated Components** | `npm audit` in CI pipeline. Docker image scanning (Trivy). |
| **A07: Identification & Auth Failures** | **Auth Service**: Implements OAuth2 best practices (Rotation, Expiry). Rate limiting on login. |
| **A08: Software & Data Integrity** | CI/CD pipeline runs tests and lints before deploy. |
| **A09: Logging & Monitoring Failures** | **Audit Service**: Dedicated service for collecting and flagging high-risk events. |
| **A10: SSRF** | API Gateway acts as a reverse proxy with strict routing rules. |
