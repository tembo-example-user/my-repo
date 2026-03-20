import { db } from "@/lib/db";
import { activityLogs, users } from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { subDays } from "date-fns";
import type { ActivityDataPoint } from "@/types/activity.types";

export type ActivityFilterType = "all" | "commit" | "pr" | "review" | "deploy";

function toActionFilter(type: ActivityFilterType): string | undefined {
  if (type === "all") return undefined;
  if (type === "pr") return "pr_merged";
  return type;
}

export async function getRecentActivity(
  teamId: string,
  days: number = 30,
  type: ActivityFilterType = "all"
): Promise<ActivityDataPoint[]> {
  const since = subDays(new Date(), days);
  const actionFilter = toActionFilter(type);
  const whereClause = actionFilter
    ? and(
        eq(activityLogs.teamId, teamId),
        gte(activityLogs.createdAt, since),
        eq(activityLogs.action, actionFilter)
      )
    : and(eq(activityLogs.teamId, teamId), gte(activityLogs.createdAt, since));

  const logs = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      resource: activityLogs.resource,
      description: activityLogs.description,
      createdAt: activityLogs.createdAt,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(whereClause)
    .orderBy(desc(activityLogs.createdAt))
    .limit(500);

  return aggregateActivityByDate(logs);
}

export function aggregateActivityByDate(
  logs: { action: string; createdAt: Date }[]
): ActivityDataPoint[] {
  const aggregated = new Map<string, ActivityDataPoint>();

  for (const log of logs) {
    const date = log.createdAt.toISOString().split("T")[0];
    const existing = aggregated.get(date);

    if (existing) {
      existing.commits += log.action === "commit" ? 1 : 0;
      existing.prs += log.action === "pr_merged" ? 1 : 0;
    } else {
      aggregated.set(date, {
        date,
        commits: log.action === "commit" ? 1 : 0,
        prs: log.action === "pr_merged" ? 1 : 0,
        user: "",
      });
    }
  }

  return Array.from(aggregated.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}
