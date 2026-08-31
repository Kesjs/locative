import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

interface DataItem {
  [key: string]: any;
}

interface RevenueChartProps {
  data: DataItem[];
  type?: "area" | "bar";
  xAxisKey?: string;
  dataKeys: string[];
  colors?: string[];
  formatter?: (value: number) => string;
}

export function RevenueChart({
  data,
  type = "area",
  xAxisKey = "month",
  dataKeys,
  colors = ["#4f46e5", "#3b82f6", "#10b981"],
  formatter = (val) => `${Number(val).toLocaleString("fr-FR")} FCFA`,
}: RevenueChartProps) {
  
  // Animation key trick to prevent rerunning animation on every render unless data length changes
  const chartKey = useMemo(() => `chart-${data.length}`, [data.length]);

  return (
    <div className="h-[220px] sm:h-[280px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        {type === "area" ? (
          <AreaChart key={chartKey} data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {dataKeys.map((key, i) => (
                <linearGradient key={`grad-${key}`} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4A4945", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4A4945", fontSize: 11, fontWeight: 500 }}
              width={48}
              tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1C1C1C",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#FAF9F6", fontSize: 11, fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: "#FAF9F6", fontSize: 12, fontWeight: 600 }}
              cursor={{ stroke: "#E8E5E0", strokeWidth: 1 }}
              formatter={(val: any, name: any) => [formatter(val), name]}
            />
            {dataKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#color-${key})`}
                isAnimationActive={true}
                animationDuration={600}
              />
            ))}
          </AreaChart>
        ) : (
          <BarChart key={chartKey} data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4A4945", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4A4945", fontSize: 11, fontWeight: 500 }}
              width={48}
              tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1C1C1C",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#FAF9F6", fontSize: 11, fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: "#FAF9F6", fontSize: 12, fontWeight: 600 }}
              cursor={{ fill: "#F5F5DC" }}
              formatter={(val: any, name: any) => [formatter(val), name]}
            />
            {dataKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={colors[i % colors.length]}
                radius={i === dataKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                isAnimationActive={true}
                animationDuration={600}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
