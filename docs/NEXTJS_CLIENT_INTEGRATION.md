# Next.js 15 Client Integration Guide: Better Auth with Node.js Express Backend

This guide details how a **Next.js 15 (App Router)** frontend application integrates with this Node.js Express backend (`node-betterAuth-postg-tempalte`) using **Better Auth**.

---

## 1. Architecture Overview

```text
Next.js Frontend (Port 4010)
    │
    │ HTTP / HTTPS with Credentials (Cookie / Bearer) + Socket.IO
    ▼
Node.js Express Backend (Port 4009)
    │
    ├── /api/auth/*  ─────────► Better Auth Engine (Single Source of Truth)
    ├── /api/v1/*    ─────────► Business & Domain API (Users, Quiz, Uploads)
    └── /socket.io/* ─────────► Realtime (session-authenticated)
```

- **Authentication Authority**: The Node.js Express backend owns all authentication credentials, user records, session tokens, and password verification.
- **Next.js Client**: Operates as a pure client without its own local database or auth tables.
- **Cookies & Sessions**: Sessions are stored in secure cookies (`better-auth.session_token`) passed via `credentials: "include"`.

---

## 2. Installation (Next.js Application)

In your Next.js project root, install `better-auth`:

```bash
pnpm add better-auth
# or
npm install better-auth
```

---

## 3. Configuration

### 3.1 Environment (`.env.local` in Next.js)

Only the standard API URL is required:

```env
# Base URL of the backend REST API
NEXT_PUBLIC_API_URL=http://localhost:4009/api/v1

# Optional: override if auth or sockets run on a separate host/port
# NEXT_PUBLIC_AUTH_URL=http://localhost:4009
# NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:4009
```

The backend must trust the frontend origin: `CORS_ORIGIN=http://localhost:4010` in the backend `.env`
(production: your real frontend URL, also via `FRONTEND_URL`).

### 3.2 URL Resolution (`src/shared/config/api.ts`)

Everything derives from the backend origin, so no extra `.env` variables are needed:

```typescript
import { env } from "@/shared/lib/env";

export const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

/** "http://localhost:4009" from "http://localhost:4009/api/v1" */
export const API_ORIGIN = new URL(env.NEXT_PUBLIC_API_URL).origin;

export const AUTH_BASE_URL = env.NEXT_PUBLIC_AUTH_URL || API_ORIGIN;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || API_ORIGIN;
```

---

## 4. Auth Client Initialization (`src/shared/lib/auth-client.ts`)

```typescript
import { createAuthClient } from "better-auth/react";
import { AUTH_BASE_URL } from "@/shared/config/api";

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
  fetchOptions: {
    credentials: "include", // Ensure session cookies are sent and received
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
```

---

## 5. Domain API Client (`src/shared/lib/http.ts`)

Ensure your global `fetcher` or Axios instance includes `credentials: "include"`.
Callers pass full paths (`fetcher("/api/v1/users")`), so prefix the **origin**, not
`NEXT_PUBLIC_API_URL` (which already ends in `/api/v1`):

```typescript
export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken(); // Better Auth session token from sign-in (Bearer fallback)
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  };

  const res = await fetch(`${API_ORIGIN}${url}`, {
    credentials: "include", // Transmits Better Auth session cookies
    ...options,
    headers,
  });

  if (!res.ok) {
    // Classification and error handling...
  }

  return res.json();
}
```

---

## 6. Authentication Hook (`src/features/auth/hooks/useAuth.ts`)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/shared/lib/auth-client";
import { login, register, logout } from "../api/login.api";

export function useAuth() {
  const queryClient = useQueryClient();
  const session = authClient.useSession();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    session: session.data,
    isSessionPending: session.isPending,
    sessionError: session.error,
  };
}
```

---

## 7. Roles & Permissions (RBAC)

### 7.1 Backend Role Hierarchy
- `SUPER_ADMIN`: Full administrative control
- `ADMIN`: Resource & user management
- `DEVELOPER`: API tools, sandbox, telemetry
- `USER`: Standard client access

### 7.2 Checking Roles in UI Components
```tsx
import { authClient } from "@/shared/lib/auth-client";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div>Loading permissions...</div>;
  if (!session || session.user.role !== "ADMIN") {
    return <div>Access Denied. Admin privileges required.</div>;
  }

  return <>{children}</>;
}
```
