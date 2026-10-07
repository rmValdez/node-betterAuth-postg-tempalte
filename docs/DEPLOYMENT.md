# Deployment Guide

This guide covers deploying the Node/PostgreSQL backend to production environments.

## Table of Contents

- [Environment Configuration](#environment-configuration)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment (ECS)](#aws-deployment-ecs)
- [Heroku Deployment](#heroku-deployment)
- [Railway Deployment](#railway-deployment)
- [Database Migrations](#database-migrations)
- [Monitoring & Observability](#monitoring--observability)
- [Security Checklist](#security-checklist)

---

## Environment Configuration

### Required Environment Variables

Before deploying, ensure these variables are set:

```env
# Core
NODE_ENV=production
PORT=5002

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/dbname?schema=public

# Authentication (JWT)
# Generate new secrets: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ACCESS_TOKEN_SECRET=<your-random-secret-32-chars>
REFRESH_TOKEN_SECRET=<your-random-secret-32-chars>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# Cache & Message Queue
REDIS_HOST=redis-host
REDIS_PORT=6379
REDIS_PASSWORD=<secure-password>
REDIS_TLS=true

RABBITMQ_URL=amqps://user:password@rabbitmq-host:5671/

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=<app-password>

# Optional: Error Tracking
SENTRY_DSN=https://your-key@sentry.io/project-id

# Service-to-Service Auth
API_KEYS=client-a:secret-key-1,client-b:secret-key-2

# CORS (Comma-separated origins)
CORS_ORIGIN=https://app.example.com,https://admin.example.com
```

### Security Best Practices

1. **Never commit `.env` file** — use environment variables in your deployment platform
2. **Rotate JWT secrets** quarterly using key versioning
3. **Use REDIS_TLS=true** in production
4. **Set CORS_ORIGIN** to specific domains (never use `*`)
5. **Store secrets in a vault** (AWS Secrets Manager, HashiCorp Vault, etc.)

---

## Docker Deployment

### Build Docker Image

```bash
# Build the image
docker build -t node-postg-backend:latest .

# Tag for registry
docker tag node-postg-backend:latest your-registry/node-postg-backend:1.0.0
```

### Docker Compose for Production

```yaml
version: '3.9'
services:
  api:
    image: your-registry/node-postg-backend:latest
    restart: always
    ports:
      - '5002:5002'
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://...
      # Add all production env vars
    depends_on:
      - db
      - redis
      - rabbitmq
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:5002/api/health/live']
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data

  rabbitmq:
    image: rabbitmq:3-management-alpine
    restart: always
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
```

---

## AWS Deployment (ECS)

### 1. Create ECR Repository

```bash
aws ecr create-repository --repository-name node-postg-backend --region us-east-1
```

### 2. Build & Push Image

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t node-postg-backend:latest .
docker tag node-postg-backend:latest [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/node-postg-backend:latest
docker push [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/node-postg-backend:latest
```

### 3. Create ECS Task Definition

Use AWS Management Console or CloudFormation to create:

- **CPU**: 256 (0.25 vCPU)
- **Memory**: 512 MB
- **Container Port**: 5002
- **Environment Variables**: Set from AWS Secrets Manager

### 4. Create ECS Service

- **Launch Type**: Fargate
- **Load Balancer**: ALB on port 80/443
- **Auto Scaling**: Min 2 tasks, Max 10 tasks

---

## Heroku Deployment

### 1. Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

### 2. Create Heroku App

```bash
heroku create your-app-name
```

### 3. Add PostgreSQL Add-on

```bash
heroku addons:create heroku-postgresql:standard-0 --app your-app-name
```

### 4. Set Environment Variables

```bash
heroku config:set NODE_ENV=production --app your-app-name
heroku config:set ACCESS_TOKEN_SECRET=$(openssl rand -hex 16) --app your-app-name
heroku config:set REFRESH_TOKEN_SECRET=$(openssl rand -hex 16) --app your-app-name
# ... set other vars
```

### 5. Deploy

```bash
git push heroku main
heroku run npm run db:setup --app your-app-name
```

---

## Railway Deployment

### 1. Connect Repository

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository

### 2. Configure Environment

1. Add PostgreSQL plugin
2. Add Redis plugin
3. Add environment variables in the UI

### 3. Deploy

Click "Deploy" — Railway will automatically:

- Build the Docker image
- Run migrations
- Start the service

---

## Database Migrations

### Automatic Migrations (Development)

```bash
npm run db:setup
```

### Manual Migrations (Production)

```bash
# Generate new migration
npx prisma migrate dev --name add_users_table

# Apply pending migrations
npx prisma migrate deploy

# Prisma Studio (inspect database)
npx prisma studio
```

### Rollback Strategy

Prisma does not support automatic rollback. For safety:

1. **Always backup** before major migrations:

   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

2. **Test migrations** in staging first

3. **Keep old migrations** — never delete them

---

## Monitoring & Observability

### Health Check Endpoint

```bash
curl http://localhost:5002/api/health/live
```

**Response**:

```json
{
  "status": "ok",
  "uptime": 1234567,
  "timestamp": "2026-01-15T10:30:00Z"
}
```

### Sentry Integration

If `SENTRY_DSN` is set, the app will send error reports:

```bash
heroku config:set SENTRY_DSN=https://your-key@sentry.io/project-id
```

### Logging

Logs are written to `stdout` as JSON in production:

```bash
# View logs (Heroku)
heroku logs --tail --app your-app-name

# View logs (Docker)
docker logs container-id --follow

# View logs (ECS)
aws logs tail /ecs/your-task-name --follow
```

### APM Integration

To integrate with New Relic, Datadog, or similar:

1. Install APM library:

   ```bash
   npm install newrelic
   ```

2. Add to `src/server.ts` (first line):

   ```typescript
   import 'newrelic';
   ```

3. Set APM environment variables

---

## Security Checklist

- [ ] `NODE_ENV=production` is set
- [ ] All secrets are in environment variables (not code)
- [ ] JWT secrets are strong (32+ chars, random)
- [ ] CORS_ORIGIN is set to specific domains
- [ ] Database user has limited permissions (not superuser)
- [ ] Redis uses TLS (`REDIS_TLS=true`)
- [ ] RabbitMQ uses credentials (not default guest:guest)
- [ ] API is behind HTTPS load balancer
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are enabled
- [ ] Database backups are automated
- [ ] Error tracking (Sentry) is configured
- [ ] Health check endpoints are monitored
- [ ] Log aggregation is set up
- [ ] Database connection pooling is configured

---

## Troubleshooting

### Database Connection Timeout

```
Error: connect timeout
```

**Solution**: Verify DATABASE_URL, check network access, increase timeout:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connect_timeout=30"
```

### RabbitMQ Connection Refused

```
Error: ECONNREFUSED
```

**Solution**: Verify RABBITMQ_URL, check service is running

### Out of Memory

**Solution**: Increase Node.js memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=512" npm start
```

### Migrations Fail

**Solution**: Check Prisma schema, rollback changes:

```bash
git revert HEAD
npx prisma migrate resolve --rolled-back migration-name
```

---

## Performance Optimization

### Connection Pooling

Prisma Connection Pool defaults to `(cpu_count × 2) + 1`. For ECS/Lambda:

```env
DATABASE_URL="postgresql://user:pass@host/db?schema=public&pool_size=5"
```

### Redis Caching

Cache frequently accessed data:

```typescript
const user = await CacheUtil.remember(
  `user:${userId}`,
  () => UserService.getUser(userId),
  3600, // TTL in seconds
);
```

### API Response Compression

Compression is enabled by default via `compression` middleware.

---

## Rollback Procedures

If deployment fails:

1. **Revert image** to previous tag:

   ```bash
   docker tag node-postg-backend:v1.0.0 node-postg-backend:latest
   ```

2. **Database migration issue**: Use backup

   ```bash
   psql $DATABASE_URL < backup.sql
   ```

3. **Environment variable issue**: Revert config
   ```bash
   heroku config:set VARIABLE=old-value
   ```

---

**Questions?** Check the main [README.md](../README.md) or review [docs/getting-started.md](./getting-started.md).
