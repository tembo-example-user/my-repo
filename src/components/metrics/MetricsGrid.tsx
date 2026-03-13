import { MetricCard } from "@/components/dashboard/MetricCard";
import type { DetailedMetrics, DateRange } from "@/types/metrics.types";

interface MetricsGridProps {
  metrics: DetailedMetrics;
  dateRange: DateRange;
}

export function MetricsGrid({ metrics, dateRange }: MetricsGridProps) {
  const period = `vs previous ${dateRange === "7d" ? "7 days" : dateRange === "30d" ? "30 days" : "90 days"}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Commits"
          value={metrics.summary.totalCommits}
          change={metrics.summary.commitChange}
          period={period}
        />
        <MetricCard
          title="PRs Merged"
          value={metrics.summary.prsMerged}
          change={metrics.summary.prChange}
          period={period}
        />
        <MetricCard
          title="Avg Review Time"
          value={`${metrics.summary.avgReviewTime}h`}
          change={metrics.summary.reviewTimeChange}
          period={period}
          invertChange
        />
        <MetricCard
          title="Active Contributors"
          value={metrics.summary.activeContributors}
          change={metrics.summary.contributorChange}
          period={period}
        />
      </div>
    </div>
  );
}
