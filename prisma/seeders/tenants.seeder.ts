import { PrismaClient } from '@prisma/client';

export async function seedTenants(prisma: PrismaClient) {
  console.log('🌱 Seeding Ecosystem Frontend Tenants...');

  const tenants = [
    {
      slug: 'default',
      name: 'Default Organization',
      description: 'Default root tenant for standard API access',
    },
    {
      slug: 'angular-v4',
      name: 'Angular 19 Master Template',
      description: 'Angular 19 Standalone Signals & TanStack Query client',
    },
    {
      slug: 'next-v1',
      name: 'Next.js 15 Starter',
      description: 'Next.js 15 App Router & Server Components client',
    },
    {
      slug: 'vue-v3',
      name: 'Vue 3.5 + Vite Starter',
      description: 'Vue 3 SPA with Pinia and Vue Query',
    },
    {
      slug: 'nuxt-v2',
      name: 'Nuxt 3 Nitro Fullstack',
      description: 'Nuxt 3 SSR and Nitro server client',
    },
    {
      slug: 'flutter-v1',
      name: 'Flutter Master Template',
      description: 'Flutter 3.x Riverpod + GoRouter cross-platform client',
    },
  ];

  for (const tenant of tenants) {
    const record = await prisma.tenant.upsert({
      where: { slug: tenant.slug },
      update: tenant,
      create: tenant,
    });
    console.log(`✅ Seeded tenant: ${record.name} (${record.slug})`);
  }
}
