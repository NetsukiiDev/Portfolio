import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  if (url.startsWith("mysql://")) {
    return new PrismaClient({ adapter: new PrismaMariaDb(url) });
  }
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
