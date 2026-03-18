import { Skeleton } from "./Skeleton";

function TeamMemberRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-1 h-3 w-16" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-4 w-8 ml-auto" />
        <Skeleton className="mt-1 h-3 w-12 ml-auto" />
      </div>
    </div>
  );
}

export function TeamTableSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <Skeleton className="h-5 w-14" />
      <Skeleton className="mt-1 h-4 w-44" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <TeamMemberRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
