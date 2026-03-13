import { z } from "zod";

export const metricsQuerySchema = z.object({
  range: z.enum(["7d", "30d", "90d"]).default("30d"),
  team: z.string().default("all"),
});

export type MetricsQuery = z.infer<typeof metricsQuerySchema>;
