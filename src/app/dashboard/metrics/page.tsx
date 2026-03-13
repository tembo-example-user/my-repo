import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDetailedMetrics } from "@/lib/db/queries/metrics";
import { MetricsFilter } from "@/components/metrics/MetricsFilter";
import { MetricsGrid } from "@/components/metrics/MetricsGrid";
import type { DateRange } from "@/types/metrics.types";

interface MetricsPageProps {
  searchParams: { range?: string; team?: string };
}

export default async function MetricsPage({ searchParams }: MetricsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const dateRange: DateRange = (searchParams.range as DateRange) || "30d";
  const teamFilter = searchParams.team || "all";

  const metrics = await getDetailedMetrics({
    teamId: session.user.teamId,
    dateRange,
    teamFilter,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Metrics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Detailed engineering metrics and trends
          </p>
        </div>
        <MetricsFilter
          currentRange={dateRange}
          currentTeam={teamFilter}
        />
      </div>

      <MetricsGrid metrics={metrics} dateRange={dateRange} />
    </div>
  );
}
