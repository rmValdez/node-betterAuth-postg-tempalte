import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import CacheUtil from '../utils/cache.util';
import { asyncLocalStorage, getContext } from '../utils/async-context';
import logger from '../utils/logger';

const TENANT_CACHE_TTL = 300; // 5 minutes

export interface TenantRequest extends Request {
  tenant?: {
    id: string;
    slug: string;
    name: string;
  };
}

/**
 * Multi-Tenant Resolution Middleware:
 * Resolves tenant from:
 * 1. Headers: `x-tenant-id` or `x-tenant-slug`
 * 2. Query parameter: `?tenant=...` or `?tenantId=...`
 * 3. Default fallback: 'default'
 *
 * Caches resolution in Redis and populates AsyncLocalStorage for downstream scope.
 */
export async function tenantMiddleware(req: TenantRequest, res: Response, next: NextFunction) {
  try {
    const rawTenantSlug =
      (req.headers['x-tenant-id'] as string) ||
      (req.headers['x-tenant-slug'] as string) ||
      (req.query.tenantId as string) ||
      (req.query.tenant as string) ||
      'default';

    const normalizedSlug = rawTenantSlug.trim().toLowerCase();

    // Cache lookup to avoid hitting Postgres on every single request
    const tenant = await CacheUtil.remember(
      `tenant:slug:${normalizedSlug}`,
      TENANT_CACHE_TTL,
      async () => {
        return prisma.tenant.findUnique({
          where: { slug: normalizedSlug },
          select: { id: true, slug: true, name: true, isActive: true },
        });
      },
    );

    if (tenant && tenant.isActive) {
      req.tenant = {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
      };

      res.setHeader('x-tenant-slug', tenant.slug);

      const ctx = getContext();
      if (ctx) {
        return asyncLocalStorage.run({ ...ctx, tenantId: tenant.id, tenantSlug: tenant.slug }, () =>
          next(),
        );
      }
    }

    next();
  } catch (error) {
    logger.error('[TenantMiddleware] Error resolving tenant, continuing request:', error);
    next();
  }
}
