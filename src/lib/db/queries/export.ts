import { db } from "@/lib/db";
import { metrics, users } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import type { ExportParams } from "@/types/export.types";

export function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

interface ExportRow {
  date: Date | null;
  type: string;
  value: number;
  userName: string | null;
  userEmail: string | null;
}

function formatExportRowsAsCsv(data: ExportRow[], includeUsers: boolean): string {
  const header = includeUsers
    ? "Date,Type,Value,User,Email\n"
    : "Date,Type,Value\n";

  const rows = data
    .map((row) => {
      const baseColumns = [
        row.date ? row.date.toISOString() : "",
        escapeCsvField(row.type),
        escapeCsvField(row.value),
      ];

      const userColumns = includeUsers
        ? [escapeCsvField(row.userName), escapeCsvField(row.userEmail)]
        : [];

      return [...baseColumns, ...userColumns].join(",");
    })
    .join("\n");

  return header + rows;
}

function formatExportRowsAsJson(data: ExportRow[], includeUsers: boolean): string {
  const rows = data.map((row) => ({
    date: row.date ? row.date.toISOString() : null,
    type: row.type,
    value: row.value,
    ...(includeUsers ? { userName: row.userName, userEmail: row.userEmail } : {}),
  }));

  return JSON.stringify(rows);
}

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
    return formatExportRowsAsJson(data, params.includeUsers);
  }

  return formatExportRowsAsCsv(data, params.includeUsers);
}
