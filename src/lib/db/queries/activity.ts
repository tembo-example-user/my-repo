import { db } from "@/lib/db";
import { activityLogs, users } from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { subDays } from "date-fns";
import type { ActivityDataPoint } from "@/types/activity.types";
import type { ActivityQuery } from "@/lib/validators/activity";

export async function getRecentActivity(
  teamId: string,
  days: number = 30,
  type: ActivityQuery["type"] = "all"
): Promise<ActivityDataPoint[]> {
  const since = subDays(new Date(), days);
  const actionFilter =
    type === "all" ? null : eq(activityLogs.action, type === "pr" ? "pr_merged" : type);
  const whereClause = actionFilter
    ? and(eq(activityLogs.teamId, teamId), gte(activityLogs.createdAt, since), actionFilter)
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
