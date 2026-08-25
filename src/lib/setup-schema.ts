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
