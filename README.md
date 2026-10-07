# node-postg-backend-template

A production-ready Node.js backend boilerplate using TypeScript, Express, and Prisma with PostgreSQL.

## Features

- **TypeScript**: Typed development with TS-Node and Nodemon.
- **Prisma ORM**: Modern database management for PostgreSQL.
- **SRC Pattern**: Service-Repository-Controller architectural pattern.
- **Logging**: Structured logging with Winston.
- **Security**: Helmet, CORS, and password hashing with Bcrypt.
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
