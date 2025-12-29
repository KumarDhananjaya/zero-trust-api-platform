# Low-Level Design (LLD) - Zero-Trust Secure API Platform (ZTSAP)

## 1. Database Schema Design (Prisma)

### 1.1 Auth Service Schema
- **User**: `id`, `email`, `password` (hashed), `roles` (string array), `createdAt`, `updatedAt`.
- **Client**: `id`, `name`, `secret` (hashed), `scope`.
- **RefreshToken**: `id`, `token`, `userId`, `expiresAt`.

### 1.2 Policy Engine Schema
- **Policy**: `id`, `name`, `roles` (string array), `actions` (string array), `resources` (string array), `effect` (allow/deny), `conditions` (JSON).

### 1.3 Audit Service Schema
- **AuditLog**: `id`, `timestamp`, `userId`, `ipAddress`, `userAgent`, `method`, `endpoint`, `status`, `riskScore`, `riskFlags` (string array).

## 2. Service Component Design

### 2.1 API Gateway Interceptors & Guards
- **AuditInterceptor**: A fire-and-forget interceptor that extracts request metadata and status code after response completion, sending it to the Audit Service asynchronously.
- **PolicyGuard**: A global guard that identifies the requested `action` and `resource` from the URL path and HTTP method, kemudian proxies the authorization decision to the Policy Engine.

### 2.2 Auth Service Logic
- **Bcrypt Integration**: Uses salt rounds (10) for secure password hashing.
- **JWT Strategy**: Implements `PassportStrategy` to validate Bearer tokens.

### 2.3 Policy Engine Evaluation Algorithm
1. Retrieve all policies matching any of the user's roles.
2. Iterate through policies:
    - If `effect` is `deny` and `action`/`resource` matches -> **Deny Immediately** (Explicit Deny).
    - If `effect` is `allow` and `action`/`resource` matches -> **Set Allow Flag**.
3. Final decision: `allow` if Allow Flag is set AND no Deny was encountered.

## 3. Communication Patterns
- **Synchronous**: Request/Response via REST (HTTP/1.1) for Auth and Policy checks (Critical path).
- **Asynchronous**: Audit logging is handled via a background HTTP call to ensure zero latency impact on the user's primary request.

## 4. Error Handling & Resilience
- **Fail-Closed**: If the Policy Engine is unreachable, the Gateway defaults to `403 Forbidden`.
- **Scoped Schemas**: Each service uses a unique PostgreSQL schema (`auth`, `policy`, `audit`) within the same DB cluster to prevent migration conflicts and data leakage.
