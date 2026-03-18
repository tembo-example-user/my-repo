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

  if (params.format === "json") {
    const jsonData = data.map((row) => ({
      date: row.date.toISOString(),
      type: row.type,
      value: row.value,
      ...(params.includeUsers
        ? {
            userName: row.userName,
            userEmail: row.userEmail,
          }
        : {}),
    }));
    return JSON.stringify(jsonData);
  }

  const escapeCsvValue = (value: string | number | null): string => {
    if (value === null) return "";
    const stringValue = String(value);
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const header = params.includeUsers
    ? "Date,Type,Value,User,Email\n"
    : "Date,Type,Value\n";

  const rows = data
    .map((row) => {
      const baseRow = [
        escapeCsvValue(row.date.toISOString()),
        escapeCsvValue(row.type),
        escapeCsvValue(row.value),
      ];

      if (!params.includeUsers) {
        return baseRow.join(",");
      }

      return [
        ...baseRow,
        escapeCsvValue(row.userName),
        escapeCsvValue(row.userEmail),
      ].join(",");
    })
    .join("\n");

  return `${header}${rows}`;
}
