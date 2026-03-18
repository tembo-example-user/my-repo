import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  period: string;
  invertChange?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  period,
  invertChange = false,
}: MetricCardProps) {
  const isNeutral = change === 0;
  const isPositive = invertChange ? change < 0 : change > 0;
  const changeColorClass = isNeutral
    ? "text-gray-500"
    : isPositive
      ? "text-green-600"
      : "text-red-600";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        <span
          className={cn(
            "inline-flex items-center text-sm font-medium",
            changeColorClass
          )}
        >
          {isNeutral ? null : isPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-400">{period}</p>
    </div>
  );
}
