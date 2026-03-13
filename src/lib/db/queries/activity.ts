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

  // TODO: Aggregate by date for chart data
  // This should return daily counts of commits and PRs
  return logs.map((log) => ({
    date: log.createdAt.toISOString().split("T")[0],
    commits: log.action === "commit" ? 1 : 0,
    prs: log.action === "pr_merged" ? 1 : 0,
    user: log.userName || "Unknown",
  }));
}
