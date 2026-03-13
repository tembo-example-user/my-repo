import { z } from "zod";

export const exportSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  format: z.enum(["csv", "json"]).default("csv"),
  includeUsers: z.boolean().default(true),
});

export type ExportParams = z.infer<typeof exportSchema>;
