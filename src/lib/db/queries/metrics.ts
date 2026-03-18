import { db } from "@/lib/db";
import { metrics, users } from "@/lib/db/schema";
import { eq, and, gte, sql, desc } from "drizzle-orm";
import { subDays } from "date-fns";
import type {
  MetricsQuery,
  TeamMetrics,
  DetailedMetrics,
  DateRange,
} from "@/types/metrics.types";

export async function getTeamMetrics(
  teamId: string,
  query?: MetricsQuery
): Promise<TeamMetrics> {
  const days = query?.range === "7d" ? 7 : query?.range === "90d" ? 90 : 30;
  const since = subDays(new Date(), days);
  const previousSince = subDays(since, days);

  const currentMetrics = await db
    .select({
      type: metrics.type,
      total: sql<number>`sum(${metrics.value})`,
    })
    .from(metrics)
    .where(and(eq(metrics.teamId, teamId), gte(metrics.recordedAt, since)))
    .groupBy(metrics.type);

  const previousMetrics = await db
    .select({
      type: metrics.type,
      total: sql<number>`sum(${metrics.value})`,
    })
    .from(metrics)
    .where(
      and(
        eq(metrics.teamId, teamId),
        gte(metrics.recordedAt, previousSince),
        sql`${metrics.recordedAt} < ${since}`
      )
    )
    .groupBy(metrics.type);

  const getValue = (data: typeof currentMetrics, type: string) =>
    data.find((m) => m.type === type)?.total ?? 0;

  const calcChange = (current: number, previous: number) =>
    previous === 0 ? 0 : Math.round(((current - previous) / previous) * 100);

  const commits = getValue(currentMetrics, "commit");
  const prevCommits = getValue(previousMetrics, "commit");
  const prs = getValue(currentMetrics, "pr_merged");
  const prevPrs = getValue(previousMetrics, "pr_merged");

  const activeContributors = await db
    .select({ count: sql<number>`count(distinct ${metrics.userId})` })
    .from(metrics)
    .where(and(eq(metrics.teamId, teamId), gte(metrics.recordedAt, since)));

  return {
    totalCommits: commits,
    commitChange: calcChange(commits, prevCommits),
    prsMerged: prs,
    prChange: calcChange(prs, prevPrs),
    avgReviewTime: 4.2, // TODO: Calculate from PR review timestamps
    reviewTimeChange: -12,
    activeContributors: activeContributors[0]?.count ?? 0,
    contributorChange: 8,
  };
}

export async function getMetricById(metricId: string, teamId: string) {
  const result = await db
    .select()
    .from(metrics)
    .where(and(eq(metrics.id, metricId), eq(metrics.teamId, teamId)))
    .limit(1);

  return result[0] || null;
}

export async function getDetailedMetrics(params: {
  teamId: string;
  dateRange: string;
  teamFilter: string;
}): Promise<DetailedMetrics> {
  // TODO: Implement detailed metrics with breakdowns by user and type
  const range: DateRange =
    params.dateRange === "7d" || params.dateRange === "90d"
      ? params.dateRange
      : "30d";
  const teamMetrics = await getTeamMetrics(params.teamId, {
    range,
    team: params.teamFilter,
  });
  return {
    summary: teamMetrics,
    byUser: [],
    byType: [],
    trends: [],
  };
}
