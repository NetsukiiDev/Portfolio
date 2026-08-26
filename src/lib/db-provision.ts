import { execFileSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";
import { upsertEnvVar, hasEnvVar } from "./env-file";
import { refreshPrismaClient } from "./prisma";
import { randomBytes } from "crypto";

export type DbSetupInput =
  | { type: "sqlite" }
  | { type: "mysql"; host: string; port: number; database: string; user: string; password: string };

const SQLITE_URL = "file:./prisma/dev.db";

function buildMysqlUrl(input: Extract<DbSetupInput, { type: "mysql" }>): string {
  const auth = `${encodeURIComponent(input.user)}:${encodeURIComponent(input.password)}`;
  return `mysql://${auth}@${input.host}:${input.port}/${input.database}`;
}

export function resolveDatabaseUrl(input: DbSetupInput): string {
  return input.type === "sqlite" ? SQLITE_URL : buildMysqlUrl(input);
}

export async function testDatabaseConnection(input: DbSetupInput): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.type === "sqlite") {
    try {
      mkdirSync(path.join(process.cwd(), "prisma"), { recursive: true });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Cannot access prisma/ directory" };
    }
  }

  const mysql = await import("mysql2/promise");
  try {
    const connection = await mysql.createConnection({
      host: input.host,
      port: input.port,
      user: input.user,
      password: input.password,
      database: input.database,
      connectTimeout: 5000,
    });
    await connection.query("SELECT 1");
    await connection.end();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not connect to the database" };
  }
}

export async function isTargetDatabaseEmpty(input: DbSetupInput): Promise<boolean> {
  if (input.type === "sqlite") return true; // fresh file, or already-migrated app DB — handled by db push idempotently

  const mysql = await import("mysql2/promise");
  const connection = await mysql.createConnection({
    host: input.host,
    port: input.port,
    user: input.user,
    password: input.password,
    database: input.database,
    connectTimeout: 5000,
  });
  try {
    const [rows] = await connection.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ?",
      [input.database],
    );
    const count = (rows as Array<{ count: number }>)[0]?.count ?? 0;
    return count === 0;
  } finally {
    await connection.end();
  }
}

export function runPrismaCommand(args: string[], databaseUrl: string): void {
  execFileSync("npx", ["prisma", ...args], {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "pipe",
    shell: true,
  });
}

// Both database types are always generated ahead of time (see the
// `db:generate:all` script, run before `dev`/`build`) into their own output
// folders, so provisioning never needs to swap `schema.prisma` or run
// `prisma generate` at request time — it only has to sync the target
// database's tables, using the schema file for whichever type was chosen,
// and then point the live client at it via refreshPrismaClient(). No
// process restart needed even when switching SQLite <-> MySQL.
export async function provisionDatabase(input: DbSetupInput): Promise<void> {
  const databaseUrl = resolveDatabaseUrl(input);
  const schemaFile = input.type === "mysql" ? "prisma/schema.mysql.prisma" : "prisma/schema.sqlite.prisma";

  runPrismaCommand(["db", "push", `--schema=${schemaFile}`, "--accept-data-loss"], databaseUrl);

  upsertEnvVar("DATABASE_URL", databaseUrl);
  if (!hasEnvVar("JWT_SECRET")) {
    upsertEnvVar("JWT_SECRET", randomBytes(32).toString("base64url"));
  }

  await refreshPrismaClient();
}
