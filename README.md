# Zero-Trust Secure API Platform (ZTSAP)

> **Enterprise-grade API Platform** demonstrating **Zero-Trust Architecture**, **DevSecOps**, and **Microservices** best practices.

## 🏗 Architecture

The platform consists of a centralized **API Gateway** that enforces security policies (AuthN/AuthZ) before routing requests to backend services.

- **`api-gateway` (Port 8080)**: Entry point. Validates JWTs & Enforces Policies.
- **`auth-service` (Port 3000)**: Identity Provider (OAuth2/OIDC).
- **`policy-engine` (Port 3001)**: Decision Point (PDP) for RBAC/ABAC.
- **`audit-service` (Port 3002)**: Ingests and analyzes security logs.
- **`dashboard` (Port 5173)**: Admin UI for monitoring and policy management.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### Quick Start
1.  **Start Infrastructure**:
    ```bash
    docker-compose up -d
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run All Services (Dev Mode)**:
    ```bash
    npm run start:dev
    ```
    This will start all microservices and the frontend concurrently.

### 🧪 Testing
- **Dashboard**: Open [http://localhost:5173](http://localhost:5173)
- **API Gateway**: `http://localhost:8080`

## 🔐 Security Features
- **Zero-Trust**: Every request is authenticated and authorized. No implicit trust between services.
- **Policy-as-Code**: Access control logic is decoupled from business logic.
- **Real-time Auditing**: All access attempts are logged and scrutinized.

## 📂 Project Structure
```
/
├── api-gateway/       # NestJS Proxy & Guards
├── auth-service/      # NestJS + Prisma + JWT
├── policy-engine/     # NestJS + Prisma + RBAC Logic
├── audit-service/     # NestJS + Prisma + Logs
├── dashboard/         # React + Vite + Tailwind
├── infra/             # K8s & Docker Configs
└── security/          # Threat Models & Compliance Docs
```

## ✨ Key Capabilities

- Centralized API Gateway with JWT validation and policy enforcement
- OAuth2 / OIDC-based authentication and authorization
- Fine-grained RBAC and ABAC via a dedicated Policy Decision Point (PDP)
- Policy-as-Code for decoupled and auditable access control
- Distributed audit logging for compliance and security analytics
- Rate limiting and request validation at the gateway layer
- Modular microservices with independent scaling and deployment
