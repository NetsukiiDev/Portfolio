import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import type { PoolConfig } from "mariadb";
import { isVercelRuntime } from "./platform";

// A deliberately-invalid placeholder: on Vercel the schema is always MySQL
// (see `vercel-build`), so before DATABASE_URL is configured we still need a
// mysql:// adapter — falling through to the sqlite branch would try to open
// a local file on Vercel's read-only filesystem and crash synchronously at
// construction time instead of failing gracefully on the first query (which
// `getSetupStatus()` already catches and treats as "database not set up yet").
const UNCONFIGURED_MYSQL_URL = "mysql://unconfigured:unconfigured@localhost:3306/unconfigured";

// mariadb's pool defaults (10s acquireTimeout) mean every request would hang
// for ~10s in proxy.ts's setup-status check while no real database is
// reachable yet (e.g. pre-configuration on Vercel). A short, explicit timeout
// keeps that failure fast. Both the setup-status gate and the root layout's
// settings lookup pay this cost independently per page load, so it's kept
// low — a real, reachable database connects in well under a second even
// over the network.
function mariaDbConfig(url: string): PoolConfig {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    connectTimeout: 2000,
    acquireTimeout: 2000,
  };
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (isVercelRuntime() || url?.startsWith("mysql://")) {
    return new PrismaClient({ adapter: new PrismaMariaDb(mariaDbConfig(url ?? UNCONFIGURED_MYSQL_URL)) });
  }
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: url ?? "file:./prisma/dev.db" }) });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
