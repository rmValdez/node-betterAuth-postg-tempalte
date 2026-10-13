# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Uses the pnpm version pinned in package.json's "packageManager" field.
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec prisma generate && pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4009

# Apply pending Prisma migrations (prisma/migrations), then start the API
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node ./dist/src/server.js"]
