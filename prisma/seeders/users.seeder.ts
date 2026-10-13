import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../../src/utils/password.util";

/**
 * Seeds initial users with bcrypt hashed passwords
 */
export async function seedUsers(prisma: PrismaClient) {
  console.log("🌱 Seeding Users...");

  const users = [
    {
      email: "superadmin@example.com",
      username: "superadmin",
      name: "Super Administrator",
      role: UserRole.SUPER_ADMIN,
      password: "Password123!",
      isEmailVerified: true,
    },
    {
      email: "admin@example.com",
      username: "admin",
      name: "System Admin",
      role: UserRole.SUPER_ADMIN,
      password: "Password123!",
      isEmailVerified: true,
    },
    {
      email: "dev@example.com",
      username: "developer",
      name: "Lead Developer",
      role: UserRole.DEVELOPER,
      password: "Password123!",
      isEmailVerified: true,
    },
    {
      email: "user@example.com",
      username: "user1",
      name: "Regular User",
      role: UserRole.USER,
      password: "Password123!",
      isEmailVerified: true,
    },
  ];

  for (const userData of users) {
    const { password, ...rest } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: rest.email },
    });

    if (!existingUser) {
      // Same hasher Better Auth is configured with (src/auth/better-auth.ts)
      const hashedPassword = await hashPassword(password);

      const newUser = await prisma.user.create({
        data: rest,
      });

      // Better Auth stores credentials on the `credential` account, not the user row
      await prisma.account.create({
        data: {
          userId: newUser.id,
          providerId: 'credential',
          accountId: newUser.id,
          password: hashedPassword,
        },
      });
      console.log(`✅ Created user & Better Auth account: ${rest.email}`);
    } else {
      console.log(`ℹ️ User already exists: ${rest.email}`);
    }
  }
}
