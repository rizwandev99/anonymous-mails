import { PrismaClient } from "@prisma/client";

// 🔌 Create Prisma Client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ⚡ Export Prisma Client as singleton
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;