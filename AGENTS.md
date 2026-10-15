# Backend Template Rules & Agent Guidelines (`node-betterAuth-postg-template`)

## 1. Git Branching and Work Safety

### Inspect Before Editing
- Before making any changes, inspect `git status`, the current branch, and `git diff`.
- Check for uncommitted changes and understand whether they belong to the current task.
- Never discard, reset, clean, stash, or commit existing work without explicit authorization.

### Dedicated Branches Are Mandatory
- Before implementing a new feature, bug fix, refactor, optimization, or other code change, create or switch to a dedicated task branch.
- Never develop directly on `main`, `master`, or a shared integration branch.
- Use descriptive branch names:
  - `feat/<short-description>` - new features
  - `fix/<short-description>` - bug fixes
  - `perf/<short-description>` - performance improvements
  - `refactor/<short-description>` - refactoring
  - `docs/<short-description>` - documentation
  - `test/<short-description>` - tests

### Preserve Existing Work
- If the current branch contains unrelated uncommitted changes, do not automatically commit, stash, or move them.
- If the task can be safely isolated, create the task branch while preserving the existing working tree.
- If existing changes overlap with the requested task or their ownership is unclear, stop and ask for clarification before editing.
- Before switching branches, check whether doing so could carry uncommitted changes into another task.

### Branch Creation and Checkpoints
- Check whether the intended branch already exists before creating it.
- If it exists, inspect its status and history before deciding whether to reuse it.
- Never reset or overwrite an existing branch to make it match a preferred starting point.
- For risky or multi-step changes, establish a recoverable baseline when the working tree is clean and it is safe to do so. Do not commit unrelated changes to create a checkpoint.

### Completion
- Report the branch used in the task completion summary.
- Do not merge into protected or shared branches, push changes, or open a pull request unless requested or authorized by the project's workflow.

---

## 2. Architecture & Layer Boundaries (SRC Pattern)
This repository enforces Clean Architecture via `pnpm validate` (`tools/validate-architecture.mjs`). Layers are strictly segregated by file suffix:

- **Repositories (`*.repository.ts`)**: Direct database and Prisma access only. May import utils, helpers, config, constants, and the Prisma client. **Never import services, controllers, or routes.**
- **Services (`*.service.ts`)**: Business and domain logic. May import repositories, infrastructure, events, utils, helpers, and constants. **Never import controllers or routes.**
- **Controllers (`*.controller.ts`)**: HTTP request handling, input extraction, and response formatting. May import services, helpers, utils, and constants. **Never import routes or make direct Prisma/database queries.**
- **Routes (`*.routes.ts`)**: Route wiring, middleware binding, and permission guards.
- **Utils / Helpers / Constants**: Agnostic logic. **Must never import any business layer.**

---

## 3. Authentication & Security (Better Auth as Single Source of Truth)
- **Better Auth Engine (`src/auth/better-auth.ts`)**: The sole authority for user credentials, password hashing, session tokens, and account state.
- **Client Session Contract**:
  - **Web Browsers**: Transmit session cookies (`better-auth.session_token`) via `credentials: "include"`.
  - **Mobile / REST Clients**: Transmit `Authorization: Bearer <better_auth_session_token>` enabled by the `bearer()` plugin in `better-auth.ts`.
  - Validate sessions using `auth.api.getSession({ headers: req.headers })` inside `src/middleware/auth.middleware.ts`.
- **Session-First Authentication**: All client authentication flows standardize purely on Better Auth sessions (cookie + bearer plugin). Do not introduce custom token signing or manual token refresh mechanisms.
- **Server-Managed Account Fields**: Fields such as `role`, `isActive`, `isDeleted`, and `onboardingCompleted` must keep `input: false` in `src/auth/better-auth.ts` so clients cannot tamper with privileges.
- **CORS & Trusted Origins**: Maintain trusted frontend origins (`http://localhost:4010`, `http://localhost:3000`) in `trustedOrigins` and `.env` (`CORS_ORIGIN`, `FRONTEND_URL`).

---

## 4. Roles & Permissions (RBAC)
- **Role Hierarchy**:
  - `SUPER_ADMIN`: Full administrative control, system metrics, and user management.
  - `ADMIN`: Resource management, settings, user role elevation.
  - `DEVELOPER`: API sandbox, developer tools, telemetry inspection.
  - `USER`: Standard client access.
- **Route Guards**:
  - Protect authenticated endpoints using `requireAuth` from `src/middleware/auth.middleware.ts`.
  - Enforce role requirements using `requireRole(UserRole.ADMIN, ...)` or granular permissions.
  - Never bypass authentication guards or allow unauthenticated access to protected domain routes.

---

## 5. Database, Prisma & Migration Safeguards
- **Schema Single Source of Truth**: All models and enums live in `prisma/schema.prisma`.
- **Review Generated SQL First**: Always inspect generated SQL migration files before applying migrations.
- **Never Auto-Generate Table Renames**: Prisma cannot detect renames automatically and may output `DROP TABLE` + `CREATE TABLE`. Hand-write `ALTER TABLE ... RENAME TO` migrations if renaming tables.
- **Always Regenerate the Client**: Run `npx prisma generate` immediately following any schema modification.
- **Seeder Integrity**: Maintain deterministic seed data in `prisma/seed.ts` and `prisma/seeders/`. Run with `pnpm run db:seed`.

---

## 6. Testing & Code Quality
- **Jest Test Suite**: Execute unit and integration tests with `pnpm test`.
- **Mock External Infrastructure**: Mock Prisma queries, Redis caching, RabbitMQ message brokers, and Nodemailer using Jest mocks (`jest.mock(...)`).
- **Honest Verification Reporting**: If any test, linter, or validation step fails, report the exact failure explicitly. **Never claim completion if `pnpm test`, `pnpm lint`, or `pnpm validate` fails.**

---

## 7. Scope Control & Task Discipline
- **Strict Scope Boundaries**: Avoid unrelated refactors, formatting sweeps, or dependency changes unless directly requested.
- **Preserve Code Intent**: Maintain existing comments, documentation, and error-handling patterns that are unrelated to your assigned changes.

---

## 8. Source of Truth & Reference Hierarchy
- **Prisma Schema (`prisma/schema.prisma`)**: Authoritative definitions for database models, fields, and `UserRole` enums.
- **`CHECKPOINT.md`**: Master checkpoint and progress record for the Better Auth migration and full-stack integration.
- **`docs/NEXTJS_CLIENT_INTEGRATION.md`**: Specification for Next.js 15 client integration, auth hooks, and fetcher configuration.
- **`docs/SYSTEM_ARCHITECTURE.md`**: Architectural specification and cross-template integration standards.
- **`AGENTS.md` (This File)**: Operational behavioral rules and guardrails that agents must strictly follow.

---

## 9. Pre-Completion Verification Checklist
Every task must execute the following 4 commands:
1. `pnpm validate` - Clean architecture layer boundary validation
2. `pnpm lint` - ESLint static code analysis
3. `pnpm test` - Jest unit and integration test suite
4. `pnpm build` - TypeScript compilation check (`tsc`)

**Reporting Requirements**: For each command, clearly categorize the result as:
- **Passed**: Clean execution.
- **Failed (Changes)**: Failed due to recent changes (must be resolved before completion).
- **Pre-existing Failure**: Unrelated failure that already existed before this task.
- **Blocked**: Cannot run due to missing environment variables or external dependencies.
*Never silently skip a check or misrepresent a blocked check as a pass.*

---

## 10. Mandatory Completion Report
Before concluding any task, provide a structured completion report with the following details:
- **Branch**: Dedicated branch used.
- **Changes**: Summary of what was implemented or resolved.
- **Files**: Key files created, modified, or removed.
- **Auth & Session Impact**: Better Auth session, cookie, or RBAC implications.
- **Database & Migration**: Schema changes, migrations, or seeder updates.
- **Verification**: Exact status of checks (`Passed`, `Failed`, `Pre-existing`, `Blocked`).
- **Remaining Work**: Known limitations, follow-up items, or frontend integration steps.

*Never declare a task complete when required verification remains unsuccessful or unperformed.*
