import { cn } from "@/lib/utils";

type SkeletonProps = React.ComponentPropsWithoutRef<"div">;

export function Skeleton({ className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 40%, #e5e7eb 80%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
      {...props}
    />
  );
}
