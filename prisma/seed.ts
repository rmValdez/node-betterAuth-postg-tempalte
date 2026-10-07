import { PrismaClient } from "@prisma/client";
import { seedTenants } from "./seeders/tenants.seeder";
import { seedUsers } from "./seeders/users.seeder";
import { seedAngularQuizQuestions } from "./seeders/angular-quiz.seeder";
import { seedVueQuizQuestions } from "./seeders/vue-quiz.seeder";
import { seedFlutterQuizQuestions } from "./seeders/flutter-quiz.seeder";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting modular database seeding...");

  try {
    await seedTenants(prisma);
    await seedUsers(prisma);
    await seedAngularQuizQuestions(prisma);
    await seedVueQuizQuestions(prisma);
    await seedFlutterQuizQuestions(prisma);
    console.log("🎉 All seeder modules executed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
