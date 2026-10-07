# Better Auth Migration Roadmap & Technical Specification

## Overview

This document details the migration of the Node.js + PostgreSQL backend template from custom JWT authentication (`jsonwebtoken`) to **Better Auth**.

The objective is to establish the Node.js backend as the **sole authority for authentication**, while maintaining clean separation from business domain logic (Multi-tenancy, Quizzes, File Storage) and Next.js frontend clients.

---

## 1. Architectural Model

```text
Next.js Frontend (Port 3000)
       │
       │ HTTP / HTTPS with Credentials (Cookie / Bearer)
       ▼
Node.js Express Backend (Port 5000)
       │
       ├── Authentication Layer (Better Auth)
       │    ├── /api/auth/* endpoint (mounted via toNodeHandler)
       │    ├── User identity (email, password hash in Account, status)
       │    ├── Session management (cookie/token validation, device metadata)
       │    ├── Account linking (OAuth Google, GitHub, Apple)
       │    └── Verification tokens (email verify, password reset)
       │
       ├── Application Domain Layer
       │    ├── Authentication Middleware (resolves req.user & req.session)
       │    ├── Authorization Middleware (Roles: USER, ADMIN, SUPER_ADMIN)
       │    ├── Multi-tenancy (Tenant resolution & TenantMembership)
       │    ├── Quizzes & Domain modules (QuizQuestion, QuizProgress)
       │    └── Media Storage (File / Avatar)
       │
       └── PostgreSQL Database (via Prisma 6)
```

---

## 2. Authentication vs Domain Model Separation

Better Auth manages authentication tables (`user`, `session`, `account`, `verification`). All application-specific entities remain distinct and reference the `user.id` foreign key.

```text
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     BETTER AUTH DOMAIN          │       │      APPLICATION DOMAIN         │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ user                            │       │ Tenant                          │
│  - id (String, PK)              │◄──┐   │  - id, slug, name, domain       │
│  - email (String, unique)       │   │   │                                 │
│  - emailVerified (Boolean)      │   │   │ TenantMembership                │
│  - name (String)                │   ├───┤  - tenantId, userId, role       │
│  - image (String?)              │   │   │                                 │
│  - role (UserRole enum)         │   │   │ QuizProgress                    │
│  - tenantId (String?, FK)       │   ├───┤  - id, tenantId, userId, score  │
│  - isActive (Boolean)           │   │   │                                 │
│  - createdAt, updatedAt         │   │   │ File                            │
│                                 │   └───┤  - id, filename, fileUrl       │
│ session                         │       └─────────────────────────────────┘
│  - id (String, PK)              │
│  - userId (FK -> user.id)       │
│  - token (String, unique)       │
│  - expiresAt (DateTime)         │
│  - ipAddress, userAgent         │
│                                 │
│ account                         │
│  - id (String, PK)              │
│  - userId (FK -> user.id)       │
│  - accountId, providerId        │
│  - password (hashed string)     │
│  - accessToken, refreshToken    │
│                                 │
│ verification                    │
│  - id, identifier, value        │
│  - expiresAt                    │
└─────────────────────────────────┘
```

---

## 3. Database Schema Mapping (Prisma)

### Target Prisma Schema Additions (`prisma/schema.prisma`):

```prisma
model User {
  id                  String             @id @default(uuid())
  email               String             @unique
  emailVerified       Boolean            @default(false)
  name                String?
  image               String?
  role                UserRole           @default(USER)
  isActive            Boolean            @default(true)
  lastLoginAt         DateTime?
  tenantId            String?
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt

  // Better Auth Relations
  sessions            Session[]
  accounts            Account[]

  // Domain Relations
  tenant              Tenant?            @relation(fields: [tenantId], references: [id], onDelete: SetNull)
  memberships         TenantMembership[]
  quizProgress        QuizProgress[]

  @@index([tenantId])
  @@map("users")
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model Account {
  id                    String    @id @default(uuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?   @db.Text
  refreshToken          String?   @db.Text
  idToken               String?   @db.Text
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?   @db.Text
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
  @@index([userId])
  @@map("accounts")
}

model Verification {
  id         String   @id @default(uuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verifications")
}
```

---

## 4. Better Auth Backend Implementation

### Setup File (`src/auth/better-auth.ts`)

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../utils/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
      tenantId: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    },
  },
});
```

### Express Mount in `src/app.ts`

```typescript
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/better-auth";

// Mount Better Auth router before other API routers
app.all("/api/auth/*", toNodeHandler(auth));
```

---

## 5. Middleware Refactoring: From JWT to Better Auth

### Previous Flow (JWT):
```text
Header: Authorization: Bearer <jwt>
   ↓
jwt.verify(token, JWT_SECRET)
   ↓
req.user = decodedToken
```

### New Flow (Better Auth):
```text
Cookie: better-auth.session_token OR Header: Authorization: Bearer <session_token>
   ↓
auth.api.getSession({ headers: req.headers })
   ↓
req.user = session.user
req.session = session.session
```

### Target `src/middleware/auth.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from "express";
import { auth } from "../auth/better-auth";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Active session required",
      });
    }

    if (!session.user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Account has been deactivated",
      });
    }

    req.user = session.user;
    req.session = session.session;
    return next();
  } catch (error) {
    return next(error);
  }
};
```

---

## 6. Next.js Frontend Integration Standard

Next.js will use `@better-auth/react` pointing to the Express backend URL.

### Client Config (`lib/auth-client.ts` in Next.js):
```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

### Key Rules for Next.js:
1. **Never create local auth tables** in the Next.js database.
2. **Include credentials** on all API calls: `fetch(url, { credentials: "include" })`.
3. Use `authClient.getSession()` in Next.js server actions / middleware.

---

## 7. Migration Execution Checklist

- [x] **Checkpoint 1**: Import baseline template from `node-postg-backend-template`
- [x] **Documentation**: Create `CHECKPOINT.md` and `docs/BETTER_AUTH_MIGRATION_ROADMAP.md`
- [ ] **Step 1**: Install `better-auth` & update `package.json`
- [ ] **Step 2**: Update `prisma/schema.prisma` with Better Auth models + custom fields
- [ ] **Step 3**: Run `npx prisma generate`
- [ ] **Step 4**: Implement `src/auth/better-auth.ts`
- [ ] **Step 5**: Mount `/api/auth/*` in `src/app.ts`
- [ ] **Step 6**: Refactor `src/middleware/auth.middleware.ts`
- [ ] **Step 7**: Update environment variables (`.env`, `.env.example`)
- [ ] **Step 8**: Update tests (`tests/integration/auth.integration.test.ts`, `tests/unit/auth.middleware.test.ts`)
- [ ] **Step 9**: Deprecate & remove `jsonwebtoken`, `bcrypt` (where replaced), and legacy JWT logic
- [ ] **Step 10**: Tag final commit `release-better-auth-v1`
