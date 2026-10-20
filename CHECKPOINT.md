# CHECKPOINT: Better Auth Full-Stack Template

> **STATUS**: CHECKPOINT 6 — HARDENED, CLEANED UP, CI GREEN
> **DATE**: 2026-10-13
> **BACKEND `main`**: `19fada1` — https://github.com/rmValdez/node-betterAuth-postg-tempalte
> **FRONTEND `main`**: `08ecec1` — https://github.com/rmValdez/next-betterAuth-template-v1
> Previous checkpoint (5, JWT + Better Auth dual auth): see git history of this file.

---

## 1. Summary

A **Node.js Express + Better Auth + PostgreSQL** backend paired with a **Next.js 15** frontend template.
Each new project clones both; they are not shared between projects.

| | Backend (`node-betterAuth-postg-tempalte`) | Frontend (`next-betterAuth-template-v1`) |
|---|---|---|
| Port | **4009** (API, Better Auth, Socket.IO) | **4010** |
| Auth | Better Auth only — session cookie or `Authorization: Bearer <session token>` | Better Auth client + `fetcher` with `credentials: "include"` |
| Pages / API | `/api/auth/*`, `/api/v1/auth/me`, `/api/v1/users` (admin), `/api/v1/quiz/*`, uploads | `/`, `/login`, `/register`, `/dashboard` (protected) |
| Tests | 51 / 51 (9 suites) | 22 / 22 (4 suites) |
| CI | ✅ green — lint, tsc, tests, build, **migrations + drift check + seed on Postgres 15** | ✅ green — lint, tsc, validate, tests, build |
| Deploys | Dockerfile runs `prisma migrate deploy` on start | ECR / Vercel workflows are **manual only** (not configured yet) |

---

## 2. What changed in this checkpoint

**Security**
- Clients can no longer set `role`, `isActive`, `isDeleted`, `onboardingCompleted` via sign-up or
  update-user (`input: false`) — closed a sign-up-as-`SUPER_ADMIN` privilege escalation.
- Legacy JWT auth removed (register/login/refresh/logout routes, token cookies, `User.password`,
  `ACCESS/REFRESH_TOKEN_*` / `COOKIE_SECRET`). `BETTER_AUTH_SECRET` is required.
- `GET /v1/users` is ADMIN/SUPER_ADMIN only; uploads require auth; Socket.IO resolves the session
  in the handshake; CORS allows localhost only in development; Better Auth rate limiting is on in
  all environments; 5xx errors no longer leak internal messages.

**Cleanup**
- Multi-tenancy removed (it was a client-supplied header, never a security boundary).
- Frontend reduced to a generic template: marketplace leftovers removed (seller layout/sidebar,
  orders/products hooks, S3 presign route, mapbox/qrcode deps); no fake role pickers on login/register.
- Fixed frontend↔backend wiring: `fetcher` built `/api/v1/api/v1/...`; `useCurrentUser` decoded
  the session token as a JWT; users contract expected `data.users` instead of `data.items`.

**Database & CI/CD**
- Prisma migrations (`prisma/migrations/20261013000000_init`); local DB `node_betterauth_template_db`.
- CI modeled on mapanytime: Postgres service container, `migrate deploy`, drift check
  (`migrate diff --exit-code` against a separate shadow DB), seeders.
- Frontend Dockerfile takes `NEXT_PUBLIC_*` as build args; `.env*` excluded from images.

---

## 3. Open items (flagged, not yet fixed)

### Fix soon
- [ ] **Bad quiz id returns 500.** `GET /api/v1/quiz/abc` → `parseInt` gives `NaN` → Prisma
      validation error → 500. Should be 400/404. (`src/controllers/quiz.controller.ts`, `show`)
- [ ] **Frontend docs are stale.** ~10 references in `README.md` / `docs/` to old ports
      (3000/3001/3002), JWT access/refresh tokens and seller pages.

### Before deploying to production
- [ ] **Cross-domain cookies.** Better Auth cookies default to `SameSite=Lax`. If frontend and backend
      live on different sites (e.g. `*.vercel.app` + `api.example.com`) the browser won't send the
      session cookie. Either host both on one parent domain (`app.example.com` + `api.example.com`,
      optionally `advanced.crossSubDomainCookies`), or set `SameSite=None; Secure` behind an env flag.
- [ ] **Configure deploy workflows** when needed (frontend): ECR → variable `AWS_DEPLOY_ROLE_ARN`,
      secret `NEXT_PUBLIC_API_URL`; Vercel → secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
      Details at the top of each workflow file.

### Product decisions (not bugs)
- [ ] **Email verification is off** (`requireEmailVerification: false`) — anyone can sign up with
      any email. Enable once the mailer (SMTP) is configured.
- [ ] **Rate limiter is in-memory** — correct for a single instance; switch Better Auth `rateLimit.storage`
      to `"database"` or Redis when running multiple instances.
- [ ] **Session token in `localStorage`** (Bearer fallback, `src/shared/lib/token.ts`) is readable by
      any script on the page if an XSS ever occurs. Cookie-only auth would be safer.
- [ ] **Socket.IO rooms** — any signed-in user can join any room except `notifications:*`.
      Add per-room authorization when building real-time features.

---

## 4. Running it locally

```bash
# backend (port 4009) — needs Postgres + BETTER_AUTH_SECRET in .env
pnpm install && pnpm run db:setup && pnpm run db:seed && pnpm dev

# frontend (port 4010) — .env.local: NEXT_PUBLIC_API_URL=http://localhost:4009/api/v1
pnpm install && pnpm dev
```

Seeded accounts (password `Password123!`): `superadmin@example.com`, `admin@example.com` (SUPER_ADMIN),
`dev@example.com` (DEVELOPER), `user@example.com` (USER).

## 5. Repository rule

- No AI co-author attribution in commits or pull requests (see `~/.claude/CLAUDE.md`).
