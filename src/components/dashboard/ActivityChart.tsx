"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ActivityDataPoint } from "@/types/activity.types";

interface ActivityChartProps {
  data: ActivityDataPoint[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
      <p className="text-sm text-gray-500 mt-1">Commits and PRs over time</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="commits"
              stackId="1"
              stroke="#0c99e9"
              fill="#e0effe"
              name="Commits"
            />
            <Area
              type="monotone"
              dataKey="prs"
              stackId="1"
              stroke="#065285"
              fill="#bae0fd"
              name="Pull Requests"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
