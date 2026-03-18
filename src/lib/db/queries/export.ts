import { db } from "@/lib/db";
import { metrics, users } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import type { ExportParams } from "@/types/export.types";

// TODO: Implement cursor-based pagination — current implementation
// times out on datasets > 10k rows (30s Vercel limit)
export async function exportMetrics(
  teamId: string,
  params: ExportParams
): Promise<string> {
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

  const escapeCsvField = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, "\"\"")}"`;
    }

    return stringValue;
  };

  const header = "Date,Type,Value,User,Email\n";
  const rows = data
    .map(
      (row) =>
        [
          escapeCsvField(row.date?.toISOString() ?? ""),
          escapeCsvField(row.type),
          escapeCsvField(row.value),
          escapeCsvField(row.userName),
          escapeCsvField(row.userEmail),
        ].join(",")
    )
    .join("\n");

  return header + rows;
}
