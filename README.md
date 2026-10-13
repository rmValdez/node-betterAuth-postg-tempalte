# node-betterAuth-postg-template

A production-ready Node.js backend boilerplate using TypeScript, Express, and Prisma with PostgreSQL, powered by **Better Auth** as the single source of truth for authentication.

> 📍 **Migration Status**: Turning Point Checkpoint 1 established.  
> Read the [Migration Checkpoint](CHECKPOINT.md) and [Better Auth Migration Roadmap](docs/BETTER_AUTH_MIGRATION_ROADMAP.md) for full architecture and execution details.

## Features

- **Better Auth Integration**: Email/password sign-up and sign-in with database-backed sessions. OAuth, email verification and password reset are not configured yet; enable them in `src/auth/better-auth.ts` when a project needs them.
- **TypeScript**: Typed development with `tsx` and `nodemon`.
- **Prisma ORM**: Modern database schema & migrations for PostgreSQL.
- **RBAC**: Role-based route guards (`requireRole`) backed by the `UserRole` enum.
- **SRC Pattern**: Service-Repository-Controller architectural pattern.
- **Logging & Observability**: Structured logging with Winston, Sentry telemetry, and Prometheus metrics.
- **Message Queuing & Cache**: RabbitMQ consumer/publisher infrastructure and Redis caching.
- **Docker**: Containerized setup with `docker-compose`.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker and Docker Compose

### Installation

1. Copy `.env.example` to `.env` and update your database credentials.
2. Install dependencies (this project uses pnpm — `corepack enable` picks up the version pinned in `package.json`):
   ```bash
   pnpm install
   ```
3. Start the database using Docker:
   ```bash
   docker-compose up -d db
   ```
4. Run Prisma migrations:
   ```bash
   pnpm run db:setup
   ```
5. Start the development server:
   ```bash
   pnpm run dev
   ```

## Folder Structure

- `src/controllers`: Request handling logic.
- `src/services`: Business logic and orchestration.
- `src/repositories`: Database access layer.
- `src/middleware`: Global and route-specific middleware.
- `src/utils`: Common utilities (logger, database client).
- `prisma`: Database schema and migrations.

## License

MIT
