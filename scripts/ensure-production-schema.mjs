import { PrismaClient } from "@prisma/client";

const isProductionDatabase = Boolean(
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL
);

if (isProductionDatabase) {
  const prisma = new PrismaClient();
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "FinanceEntry" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3)'
    );
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "dateText" TEXT'
    );
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Event" ALTER COLUMN "date" DROP NOT NULL'
    );
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "FinanceEntry" ALTER COLUMN "date" DROP NOT NULL'
    );
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "FinanceEntry" ALTER COLUMN "date" DROP DEFAULT'
    );
    console.log("Production schema checked.");
  } finally {
    await prisma.$disconnect();
  }
} else {
  console.log("Skipping production schema check outside PostgreSQL deployment.");
}
