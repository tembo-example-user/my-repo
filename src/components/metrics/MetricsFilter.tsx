"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { DateRange } from "@/types/metrics.types";

interface MetricsFilterProps {
  currentRange: DateRange;
  currentTeam: string;
}

export function MetricsFilter({ currentRange, currentTeam }: MetricsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/dashboard/metrics?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex rounded-md border border-gray-200 bg-white">
        {(["7d", "30d", "90d"] as DateRange[]).map((range) => (
          <button
            key={range}
            onClick={() => updateFilter("range", range)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              currentRange === range
                ? "bg-brand-50 text-brand-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days"}
          </button>
        ))}
      </div>
    </div>
  );
}
