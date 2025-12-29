# Interview Preparation Guide - Zero-Trust API Platform

This guide covers senior-level questions regarding the architecture, security, and design decisions made in this project.

## 1. System Design & Architecture

**Q: Why did you choose a Microservices architecture for this platform?**
**A:** Separation of concerns. Authentication, Authorization, and Auditing have different scaling and security requirements. For instance, the Policy Engine can be scaled independently during peak authorization traffic without affecting user profile management in the Auth Service. It also allows for isolated database schemas, reducing the blast radius of a potential breach.

**Q: How does the Gateway handle "Policy-as-Code" without becoming a bottleneck?**
**A:** Currently, the Gateway makes a synchronous call to the Policy Engine. To optimize this in production, we could implement a distributed cache (Redis) for common authorization decisions with a short TTL, or use a "Sidecar" pattern (like Open Policy Agent) for local evaluation.

## 2. Security (Zero-Trust)

**Q: Explain the "Never Trust, Always Verify" implementation in your project.**
**A:** We don't trust the internal network. Even if a request comes from another service, it must go through the Gateway or carry a valid identity token. Every single request is re-validated against the Policy Engine (`PolicyGuard`) based on the current context (User, Action, Resource), not just a session cookie.

**Q: How do you protect against the OWASP Top 10?**
**A:** 
- **Broken Access Control**: Centralized in the Policy Engine.
- **Cryptographic Failures**: Using Bcrypt for passwords and TLS for service communication.
- **Injection**: Using Prisma (ORM) which provides parameterized queries by default.
- **Security Misconfiguration**: Isolated Postgres schemas and environment-based configuration.

## 3. Concurrency & Performance

**Q: How do you ensure the Audit logging doesn't slow down the main API response?**
**A:** We use a "fire-and-forget" pattern in the `AuditInterceptor`. The Gateway initiates the audit request and does not `await` the response before sending the client their data (or it uses Node.js `process.nextTick` / `setImmediate` style logic).

**Q: How do you handle database migrations in a shared-cluster but multi-schema environment?**
**A:** Each microservice has its own `schema.prisma` file pointing to a specific schema (e.g., `?schema=auth`). Migrations are run independently per service. This prevents a schema change in the Audit service from affecting the Auth service database.

## 4. Behavioral / Design Decisions

**Q: What would you change if the user base scaled to millions?**
**A:** 
1. Replace synchronous service-to-service calls with a message broker (Kafka/RabbitMQ) for the Audit logs.
2. Implement Token Binding (DPoP) to prevent JWT theft.
3. Move from custom JSON policies to a formal language like OPA (Rego) or AWS Cedar.
4. Implement a distributed Rate Limiter using Redis.
