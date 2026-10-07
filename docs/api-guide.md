# 🔌 API Guide

Reference documentation for building and consuming the REST API.

---

## Base URL

```
http://localhost:3002/api
```

All endpoints are prefixed with `/api/v1` except health checks.

---

## Authentication

This API uses **JWT Bearer tokens**.

### Register / Login Flow

```
POST /api/v1/auth/register       → returns { message, data: { user, accessToken, refreshToken } }
POST /api/v1/auth/login          → returns { message, data: { user, accessToken, refreshToken } }
POST /api/v1/auth/refresh        → exchange refreshToken for a new accessToken
POST /api/v1/auth/logout         → invalidate session
```

### Using the Token

Add the access token to every authenticated request:

```
Authorization: Bearer <accessToken>
```

Tokens expire after `15m` by default (`ACCESS_TOKEN_EXPIRY` in `.env`), with refresh tokens expiring after `7d` (`REFRESH_TOKEN_EXPIRY`).

---

## Service-to-Service Auth (X-API-Key)

For requests from _another backend_ rather than a logged-in user — no JWT,
no user session, just a shared secret identifying which service is calling.

Configure one key per calling service in `.env`:

```
API_KEYS="partner-a:8f2c9e1a...,internal-billing:1a9d4b7c..."
```

Generate a key:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Callers send it as a header:

```
GET /api/v1/partner/users
X-API-Key: 8f2c9e1a...
```

Routes under `/api/v1/partner` are protected by the `apiKeyAuth` middleware
([src/middleware/apiKey.middleware.ts](../src/middleware/apiKey.middleware.ts))
instead of `authenticate`. It resolves the key to a client name (`req.apiClient`)
so you can log/authorize per-integration, and never mix `apiKeyAuth` with
`authenticate` on the same route — they answer different questions ("which
service is this" vs "which user is this").

---

## Response Format

All responses follow a consistent envelope.

### Success — Single Resource

```json
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "message": "Optional message"
}
```

### Success — Paginated List

```json
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "items": [ ... ],
    "total": 87,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Error

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "User not found",
  "code": "USER_NOT_FOUND",
  "details": {}
}
```

---

## Pagination

All list endpoints support these query parameters:

| Param       | Type            | Default | Description              |
| ----------- | --------------- | ------- | ------------------------ |
| `page`      | integer         | `1`     | Page number              |
| `limit`     | integer         | `20`    | Items per page (max 100) |
| `sortBy`    | string          | —       | Field to sort by         |
| `sortOrder` | `asc` \| `desc` | —       | Sort direction           |
| `search`    | string          | —       | Search term              |

**Example:**

```
GET /api/v1/users?page=2&limit=10&sortBy=createdAt&sortOrder=desc
```

---

## Tracing Headers

Every response includes tracing headers for debugging:

| Header             | Description                                      |
| ------------------ | ------------------------------------------------ |
| `x-request-id`     | Unique ID for this specific HTTP call            |
| `x-correlation-id` | Business operation ID — same across all services |

Pass your own `x-correlation-id` to trace a request end-to-end:

```
x-correlation-id: my-trace-id-12345
```

---

## Endpoints

### Health

| Method | Endpoint            | Auth | Description                    |
| ------ | ------------------- | ---- | ------------------------------ |
| `GET`  | `/api/health/live`  | ❌   | Process liveness check         |
| `GET`  | `/api/health/ready` | ❌   | Infrastructure readiness check |

**Liveness response:**

```json
{ "status": "ok", "timestamp": "...", "uptime": 3600 }
```

**Readiness response:**

```json
{
  "status": "ready",
  "timestamp": "...",
  "uptime": 3600,
  "services": { "database": "up", "redis": "up", "rabbitmq": "up" }
}
```

---

### Authentication

| Method | Endpoint                     | Auth | Description          |
| ------ | ---------------------------- | ---- | -------------------- |
| `POST` | `/api/v1/auth/register`      | ❌   | Create account       |
| `POST` | `/api/v1/auth/login`         | ❌   | Sign in              |
| `POST` | `/api/v1/auth/refresh-token` | ❌   | Refresh access token |
| `POST` | `/api/v1/auth/logout`        | ✅   | Sign out             |

**Register request** (`username` is required, `name` is optional):

```json
{
  "email": "user@example.com",
  "password": "MySecureP@ssw0rd!",
  "username": "someuser"
}
```

**Login response** — note: auth endpoints don't use the standard
`{status, statusCode, data}` envelope (see [Response Format](#response-format))
— `login`/`register` wrap in `{message, data}`, and `refresh-token` returns a
bare object with no wrapper at all:

```json
{
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": { "id": "uuid", "email": "user@example.com", "role": "USER", "...": "..." }
  }
}
```

---

### Users

| Method | Endpoint           | Auth | Description                                         |
| ------ | ------------------ | ---- | --------------------------------------------------- |
| `GET`  | `/api/v1/users/me` | ✅   | Get authenticated user's profile                    |
| `GET`  | `/api/v1/users`    | ✅   | List all users (paginated) — `ADMIN`+ role required |
| `POST` | `/api/v1/users`    | ✅   | Create a new user — `ADMIN`+ role required          |

---

### File Uploads

| Method | Endpoint               | Auth | Description                         |
| ------ | ---------------------- | ---- | ----------------------------------- |
| `POST` | `/api/v1/file-uploads` | ✅   | Upload a file (multipart/form-data) |

---

## Error Codes Reference

| HTTP Status | Meaning                                                         |
| ----------- | --------------------------------------------------------------- |
| `400`       | Bad Request — invalid input or validation failure               |
| `401`       | Unauthorized — missing or invalid token                         |
| `403`       | Forbidden — authenticated but insufficient permissions          |
| `404`       | Not Found — resource doesn't exist                              |
| `409`       | Conflict — duplicate resource (e.g., email already taken)       |
| `422`       | Unprocessable Entity — valid format but business rule violation |
| `429`       | Too Many Requests — rate limit exceeded                         |
| `500`       | Internal Server Error — unexpected server failure               |

---

## Rate Limiting

In production, the API is rate-limited to **100 requests per 15 minutes per IP**.

Rate limiting is disabled in `development` mode.

---

## Interactive Docs

Open [http://localhost:5002/api/docs](http://localhost:5002/api/docs) in your browser for the full Swagger UI with request/response examples and a built-in API tester.

> Available in development mode only.

---

## Adding API Documentation to a Route

Use JSDoc annotations in your controller or route file:

```typescript
/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
```
