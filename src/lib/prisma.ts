import { PrismaClient as SqlitePrismaClient } from "@/generated/prisma-sqlite/client";
import { PrismaClient as MysqlPrismaClient } from "@/generated/prisma-mysql/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Both schema variants define identical models — only the datasource
// provider and a couple of @db.Text hints differ — so the two generated
// clients are structurally interchangeable at the TypeScript level.
type AnyPrismaClient = SqlitePrismaClient;

function createPrismaClient(): AnyPrismaClient {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  if (url.startsWith("mysql://")) {
    return new MysqlPrismaClient({ adapter: new PrismaMariaDb(url) }) as unknown as AnyPrismaClient;
  }
  return new SqlitePrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
}

const globalForPrisma = globalThis as unknown as { prismaClient?: AnyPrismaClient };

function getActiveClient(): AnyPrismaClient {
  if (!globalForPrisma.prismaClient) {
    globalForPrisma.prismaClient = createPrismaClient();
  }
  return globalForPrisma.prismaClient;
}

// A stable proxy so every existing `import { prisma }` call site keeps
// working unchanged — refreshPrismaClient() swaps what it points to
// underneath (e.g. right after the setup wizard switches SQLite <-> MySQL),
// with no process restart required, since each access is resolved live
// against whichever client is currently active. Functions are bound to the
// real client so methods like `$disconnect()` keep the `this` their
// implementation relies on internally.
export const prisma: AnyPrismaClient = new Proxy({} as AnyPrismaClient, {
  get(_target, prop) {
    const client = getActiveClient();
    const value = Reflect.get(client as object, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

// Called right after the setup wizard (re)provisions a database, which may
// be a different provider than the one currently connected. Disconnects the
// outgoing client and drops the cache; the next access above lazily builds
// a fresh one from the now-current DATABASE_URL.
export async function refreshPrismaClient(): Promise<void> {
  const previous = globalForPrisma.prismaClient;
  globalForPrisma.prismaClient = undefined;
  if (previous) {
    await previous.$disconnect().catch(() => {});
  }
}
