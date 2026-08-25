import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

// Next.js's built-in dotenv loader expands `$var` references — an unescaped
// literal `$` in a generated secret or a user-supplied DB password gets
// silently corrupted unless escaped here.
function escapeDollar(value: string): string {
  return value.replace(/\$/g, "\\$");
}

export function hasEnvVar(key: string): boolean {
  if (!existsSync(ENV_PATH)) return false;
  return new RegExp(`^${key}=`, "m").test(readFileSync(ENV_PATH, "utf-8"));
}

export function upsertEnvVar(key: string, value: string): void {
  const lines = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf-8").split(/\r?\n/) : [];
  const newLine = `${key}="${escapeDollar(value)}"`;
  const index = lines.findIndex((line) => line.startsWith(`${key}=`));
  if (index >= 0) {
    lines[index] = newLine;
  } else {
    if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
    lines.push(newLine);
  }
  writeFileSync(ENV_PATH, lines.join("\n") + "\n");
}
