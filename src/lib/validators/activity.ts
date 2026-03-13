import { z } from "zod";

export const activityQuerySchema = z.object({
  days: z.number().min(1).max(365).default(30),
  type: z.enum(["all", "commit", "pr", "review", "deploy"]).default("all"),
});

export type ActivityQuery = z.infer<typeof activityQuerySchema>;
