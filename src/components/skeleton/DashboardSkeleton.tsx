import { MetricCardSkeleton } from "./MetricCardSkeleton";
import { ActivityChartSkeleton } from "./ActivityChartSkeleton";
import { TeamTableSkeleton } from "./TeamTableSkeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-4 w-72 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChartSkeleton />
        </div>
        <div>
          <TeamTableSkeleton />
        </div>
      </div>
    </div>
  );
}
