import { Skeleton } from "./Skeleton";

export function MetricCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <Skeleton className="h-4 w-24" />
      <div className="mt-2 flex items-baseline gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="mt-1 h-3 w-16" />
    </div>
  );
}
