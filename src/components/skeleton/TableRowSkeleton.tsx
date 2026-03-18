import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";

interface TableRowSkeletonProps {
  rows?: number;
  columns?: number;
  showAvatar?: boolean;
  className?: string;
}

export function TableRowSkeleton({
  rows = 5,
  columns = 3,
  showAvatar = false,
  className,
}: TableRowSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 rounded-md border border-gray-100 bg-white px-4 py-3"
        >
          {showAvatar && <Skeleton className="h-8 w-8 shrink-0 rounded-full" />}
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                "h-4",
                colIndex === 0 ? "w-1/3" : colIndex === columns - 1 ? "w-16 ml-auto" : "w-1/4",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
