# Backend Database, Seeding & CORS Guide

This document details database setup, Prisma seeders, credentials, and CORS configuration for `node-postg-backend-template`.

---

## 🗄️ 1. Database Schema & Setup

The backend uses **Prisma** with **PostgreSQL**.

### Push Schema to Database
To create or update all database tables (`tenants`, `users`, `quiz_questions`, `quiz_progress`, `roles`, etc.):
```bash
npx prisma db push
```

### Seed Database
To populate essential data (tenants, default users, and 100 Flutter quiz questions):
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
- `x-tenant-slug`, `X-Tenant-Slug`
- `x-session-id`, `X-Session-Id`
- `x-tenant-id`, `X-Tenant-Id`

---

## 🛣️ 4. Key Route Aliases

Both route conventions are supported:
- Direct: `POST /api/v1/login`, `POST /api/v1/register`
- Auth nested: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`
- Quiz questions: `GET /api/v1/quiz/questions`
- Quiz progress: `POST /api/v1/quiz/progress`

---

## 🍪 5. HTTP-Only Cookie Authentication

The API supports dual authentication modes: **HTTP-only Cookies** (recommended for Web browsers) and **Bearer Authorization headers** (for mobile apps, CLI, and external API clients).

### Cookie Configuration
| Cookie Name | Purpose | Flags | Expiration |
|---|---|---|---|
| `accessToken` | Access token for API authorization | `httpOnly: true`, `sameSite: 'lax'` (or `'none'` in prod HTTPS), `path: '/'` | 1 day (`ACCESS_TOKEN_EXPIRY`) |
| `refreshToken` | Long-lived session token used to issue new access tokens | `httpOnly: true`, `sameSite: 'lax'` (or `'none'` in prod HTTPS), `path: '/'` | 7 days (`REFRESH_TOKEN_EXPIRY`) |

### How It Works
1. **Login & Register**:
   - Responding to `POST /api/v1/auth/login` or `POST /api/v1/auth/register` sets `accessToken` and `refreshToken` cookies automatically via `Set-Cookie`.
   - The JSON body still returns `{ accessToken, refreshToken, user }` for non-cookie clients.
2. **Authenticated Requests**:
   - Web clients include cookies automatically when credentials are enabled:
     - `fetch('/api/v1/auth/me', { credentials: 'include' })`
     - Axios / Dio: `withCredentials: true`
   - The `authenticate` middleware checks `req.cookies.accessToken` first, falling back to `Authorization: Bearer <token>`.
3. **Token Refresh**:
   - `POST /api/v1/auth/refresh` reads `refreshToken` from the cookie (or JSON body `{ refreshToken: "..." }`) and writes a new `accessToken` cookie.
4. **Logout**:
   - `POST /api/v1/auth/logout` invalidates the database session and clears both `accessToken` and `refreshToken` cookies.

