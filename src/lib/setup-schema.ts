import { z } from "zod";

export const dbSetupSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("sqlite") }),
  z.object({
    type: z.literal("mysql"),
    host: z.string().min(1),
    port: z.coerce.number().int().min(1).max(65535),
    database: z.string().min(1),
    user: z.string().min(1),
    password: z.string(),
  }),
]);

const DB_SETUP_FIELDS = ["host", "port", "database", "user", "password"] as const;
export type DbSetupField = (typeof DB_SETUP_FIELDS)[number];

// The client localizes this into the wizard's current language — the server
// only reports which field failed, not a display-ready message.
export function getDbSetupErrorField(error: z.ZodError): DbSetupField | null {
  const field = error.issues[0]?.path[0];
  return typeof field === "string" && (DB_SETUP_FIELDS as readonly string[]).includes(field)
    ? (field as DbSetupField)
    : null;
}
