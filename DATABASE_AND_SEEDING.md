# Backend Database, Seeding & CORS Guide

This document details database setup, Prisma seeders, credentials, and CORS configuration for `node-postg-backend-template`.

---

## 🗄️ 1. Database Schema & Setup

The backend uses **Prisma** with **PostgreSQL**.

### Apply Migrations
The schema is versioned in `prisma/migrations`. To create or update all tables
(`users`, `sessions`, `accounts`, `quiz_questions`, `quiz_progress`, etc.):
```bash
pnpm run db:setup          # prisma generate + migrate dev (local development)
npx prisma migrate deploy  # production / CI (the Docker image runs this on start)
```
After changing `prisma/schema.prisma`, create a new migration with
`npx prisma migrate dev --name <change>` and commit it.

### Seed Database
To populate essential data (default users and the Angular, Vue and Flutter quiz banks):
```bash
npx prisma db seed
```

---

## 👤 2. Default Seeded Accounts

All accounts use bcrypt password hashing:

| Role | Email | Password | Username |
|---|---|---|---|
| `SUPER_ADMIN` | `superadmin@example.com` | `Password123!` | `superadmin` |
| `SUPER_ADMIN` | `admin@example.com` | `Password123!` | `admin` |
| `DEVELOPER` | `dev@example.com` | `Password123!` | `developer` |
| `USER` | `user@example.com` | `Password123!` | `user1` |

---

## 🌐 3. CORS & Flutter Web Integration

The CORS middleware is configured in [`src/middleware/cors.middleware.ts`](file:///c:/Users/devrm/Documents/GitHub/rm-template/node-postg-backend-template/src/middleware/cors.middleware.ts).

### Allowed Origins
- `http://localhost:8085` (Flutter Web dev server)
- `http://localhost:3000` (Next.js)
- `http://localhost:4200` (Angular)
- `http://localhost:5173` (Vue)
- `http://localhost:4000` (Nuxt)

### Allowed Headers
- `Content-Type`, `Authorization`, `Accept`, `Origin`, `X-Requested-With`
- `x-session-id`, `X-Session-Id`
- `x-correlation-id`, `X-Correlation-Id`

---

## 🛣️ 4. Key Routes

- Auth (Better Auth): `POST /api/auth/sign-up/email`, `POST /api/auth/sign-in/email`, `POST /api/auth/sign-out`, `GET /api/auth/get-session`
- Profile + permissions: `GET /api/v1/auth/me`
- Quiz questions: `GET /api/v1/quiz`, `GET /api/v1/quiz/:id`
- Quiz progress: `GET|POST /api/v1/quiz/progress`, `POST /api/v1/quiz/progress/reset`
  (signed-in users are identified by their session; guests must send `x-session-id`)

---

## 🍪 5. Authentication (Better Auth sessions)

Better Auth is the only authentication system. Sessions are stored in the `sessions` table and identified two ways:

1. **Browsers — session cookie.** Sign-in / sign-up set the httpOnly `better-auth.session_token` cookie.
   Send it on API calls with `fetch(url, { credentials: 'include' })`, or `withCredentials: true` (Axios, Socket.IO).
2. **Mobile / CLI / Postman — Bearer token.** Sign-in / sign-up also return a `token`; send it as
   `Authorization: Bearer <token>` (enabled by the Better Auth `bearer` plugin).

Sessions last 7 days and are refreshed daily while in use (`session` options in `src/auth/better-auth.ts`).
Sign out with `POST /api/auth/sign-out`, which revokes the session server-side.

Roles and account flags (`role`, `isActive`, `isDeleted`, `onboardingCompleted`) are server-managed:
clients cannot set them through sign-up or update-user.

