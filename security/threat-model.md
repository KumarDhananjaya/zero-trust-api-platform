# Threat Model - Zero-Trust API Platform (ZTSAP)

## System Description
ZTSAP is a centralized API platform enforcing Zero-Trust principles. It validates every request via an API Gateway, issues short-lived tokens via an Auth Service, and enforces fine-grained permissions via a Policy Engine.

## Trust Boundaries
1.  **Public Internet vs. API Gateway**: The only exposed entry point (Port 8080).
2.  **API Gateway vs. Internal Services**: Internal mTLS (simulated network isolation).
3.  **Services vs. Data Stores**: Credentials required for DB/Redis access.

## STRIDE Analysis

### 1. Spoofing Identity
*   **Threat**: Attacker impersonates a user using a stolen token.
*   **Mitigation**:
    *   **Short-lived Access Tokens** (15 min).
    *   **Refresh Token Rotation**: Detects reuse chains.
    *   **JWT Signing**: RS256 (or HS256 with strong secrets) prevents token forging.

### 2. Tampering with Data
*   **Threat**: Attacker modifies a policy to grant themselves admin access.
*   **Mitigation**:
    *   **RBAC on Policy Management**: Only admins can POST to `/policies`.
    *   **Audit Logging**: All changes to policies are logged immutably (Write-Once).
    *   **Input Validation**: Zod/DTOS validation on all inputs.

### 3. Repudiation
*   **Threat**: User performs a malicious action and denies it.
*   **Mitigation**:
    *   **Comprehensive Auditing**: Every request to the Gateway is logged to the Audit Service with `userId`, `ip`, and `timestamp`.
    *   **Non-repudiation**: Logs are stored in a separate schema/database (conceptually).

### 4. Information Disclosure
*   **Threat**: Leakage of PII or tokens in logs.
*   **Mitigation**:
    *   **Log Sanitization**: Passwords and raw tokens are scrubbed before logging.
    *   **Error Handling**: production mode enabled; strict exception filters hide stack traces.

### 5. Denial of Service (DoS)
*   **Threat**: Attacker floods the API Gateway.
*   **Mitigation**:
    *   **Rate Limiting**: Redis-backed throttler in API Gateway (Token Bucket).
    *   **Resource Limits**: Docker container memory/CPU limits.

### 6. Elevation of Privilege
*   **Threat**: Regular user accesses Admin APIs.
*   **Mitigation**:
    *   **Policy Engine (PDP)**: Every request is evaluated against explicit Allow policies. Default is Deny.
    *   **Scope validation**: OAuth2 scopes are enforced.
