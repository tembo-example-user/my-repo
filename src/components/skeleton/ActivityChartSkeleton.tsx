import { Skeleton } from "./Skeleton";

export function ActivityChartSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="mt-1 h-4 w-44" />
      <div className="mt-4 h-64 flex items-end gap-2">
        {[40, 65, 30, 80, 55, 45, 70, 60, 35, 75, 50, 85].map(
          (height, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t"
              style={{ height: `${height}%` }}
            />
          )
        )}
      </div>
    </div>
  );
}
