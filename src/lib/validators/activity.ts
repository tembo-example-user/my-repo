import { z } from "zod";

export const activityQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
  type: z.enum(["all", "commit", "pr"]).default("all"),
});

export type ActivityQuery = z.infer<typeof activityQuerySchema>;
