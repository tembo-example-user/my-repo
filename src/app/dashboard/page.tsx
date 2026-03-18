import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { TeamTable } from "@/components/dashboard/TeamTable";
import { getTeamMetrics } from "@/lib/db/queries/metrics";
import { getRecentActivity } from "@/lib/db/queries/activity";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const metrics = await getTeamMetrics(session.user.teamId);
  const activity = await getRecentActivity(session.user.teamId, { days: 30 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your team's engineering activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Commits"
          value={metrics.totalCommits}
          change={metrics.commitChange}
          period="vs last month"
        />
        <MetricCard
          title="PRs Merged"
          value={metrics.prsMerged}
          change={metrics.prChange}
          period="vs last month"
        />
        <MetricCard
          title="Avg Review Time"
          value={`${metrics.avgReviewTime}h`}
          change={metrics.reviewTimeChange}
          period="vs last month"
          invertChange
        />
        <MetricCard
          title="Active Contributors"
          value={metrics.activeContributors}
          change={metrics.contributorChange}
          period="vs last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-80 bg-white rounded-lg animate-pulse" />}>
            <ActivityChart data={activity} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div className="h-80 bg-white rounded-lg animate-pulse" />}>
            <TeamTable teamId={session.user.teamId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
