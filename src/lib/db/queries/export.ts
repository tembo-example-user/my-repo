import { db } from "@/lib/db";
import { metrics, users } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import type { ExportParams, ExportMetricRow } from "@/types/export.types";

// TODO: Implement cursor-based pagination — current implementation
// times out on datasets > 10k rows (30s Vercel limit)
export async function exportMetrics(
  teamId: string,
  params: ExportParams
): Promise<ExportMetricRow[]> {
  const data = await db
    .select({
      date: metrics.recordedAt,
      type: metrics.type,
      value: metrics.value,
      userName: users.name,
      userEmail: users.email,
    })
    .from(metrics)
    .leftJoin(users, eq(metrics.userId, users.id))
    .where(
      and(
        eq(metrics.teamId, teamId),
        gte(metrics.recordedAt, new Date(params.startDate)),
        lte(metrics.recordedAt, new Date(params.endDate))
      )
    );
  return data;
}
