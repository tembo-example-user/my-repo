import { Skeleton } from "@/components/skeleton/Skeleton";
import { MetricsGridSkeleton } from "@/components/skeleton";

export default function MetricsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-28" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-16 rounded-md" />
          ))}
        </div>
      </div>

      <MetricsGridSkeleton />
    </div>
  );
}
