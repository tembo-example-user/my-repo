import { db } from "@/lib/db";
import { activityLogs, users } from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { subDays } from "date-fns";
import type { ActivityDataPoint } from "@/types/activity.types";

export async function getRecentActivity(
  teamId: string,
  days: number = 30
): Promise<ActivityDataPoint[]> {
  const since = subDays(new Date(), days);

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
    .where(and(eq(activityLogs.teamId, teamId), gte(activityLogs.createdAt, since)))
    .orderBy(desc(activityLogs.createdAt))
    .limit(500);

  // Aggregate by date for chart data — sum commits and PRs per day
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

  // Return sorted by date ascending for proper chart rendering
  return Array.from(aggregated.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}
