import { PrismaClient } from "@prisma/client";

const isProductionDatabase = Boolean(process.env.POSTGRES_PRISMA_URL);

if (isProductionDatabase) {
  const prisma = new PrismaClient();
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "FinanceEntry" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3)'
    );
    console.log("Production finance schema checked.");
  } finally {
    await prisma.$disconnect();
  }
} else {
  console.log("Skipping production schema check outside PostgreSQL deployment.");
}
