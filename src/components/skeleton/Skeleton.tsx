import { cn } from "@/lib/utils";

type SkeletonProps = React.ComponentPropsWithoutRef<"div">;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded bg-gray-200", className)}
      {...props}
    />
  );
}
