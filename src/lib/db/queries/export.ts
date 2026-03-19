import { db } from "@/lib/db";
import { metrics, users } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import type { ExportParams } from "@/types/export.types";

interface ExportRowWithUsers {
  date: string;
  type: string;
  value: number;
  userName: string;
  userEmail: string;
}

interface ExportRowNoUsers {
  date: string;
  type: string;
  value: number;
}

export function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function rowsToCsv(
  rows: ExportRowWithUsers[] | ExportRowNoUsers[],
  includeUsers: boolean
): string {
  const header = includeUsers
    ? "Date,Type,Value,User,Email\n"
    : "Date,Type,Value\n";

  const lines = rows.map((row) => {
    const base = [
      escapeCsvField(row.date),
      escapeCsvField(row.type),
      escapeCsvField(row.value),
    ];

    if (!includeUsers) {
      return base.join(",");
    }

    const userRow = row as ExportRowWithUsers;
    return [
      ...base,
      escapeCsvField(userRow.userName),
      escapeCsvField(userRow.userEmail),
    ].join(",");
  });

  return header + lines.join("\n");
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

  const rows = data.map((row) => ({
    date: row.date ? row.date.toISOString() : "",
    type: row.type,
    value: row.value,
    userName: row.userName ?? "",
    userEmail: row.userEmail ?? "",
  }));

  if (params.includeUsers === false) {
    const noUserRows: ExportRowNoUsers[] = rows.map(({ date, type, value }) => ({
      date,
      type,
      value,
    }));
    return params.format === "json"
      ? JSON.stringify(noUserRows)
      : rowsToCsv(noUserRows, false);
  }

  return params.format === "json"
    ? JSON.stringify(rows)
    : rowsToCsv(rows, true);
}
