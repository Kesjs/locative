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
  type = "bar",
  xAxisKey = "month",
  dataKeys,
  colors = [
    "hsl(38, 92%, 50%)", // Lokka Primary (Terre Cuite)
    "hsl(142.1, 76.2%, 36.3%)", // Lokka Success (Emerald)
    "hsl(38, 92%, 50%)", // Lokka Warning (Amber)
  ],
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
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
              width={48}
              tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                padding: "8px 12px",
                boxShadow: "var(--shadow-modal)",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))", fontSize: 11, fontWeight: 700, marginBottom: 4 }}
              itemStyle={{ color: "hsl(var(--popover-foreground))", fontSize: 12, fontWeight: 600 }}
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
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
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
              width={48}
              tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                padding: "8px 12px",
                boxShadow: "var(--shadow-modal)",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))", fontSize: 11, fontWeight: 700, marginBottom: 4 }}
              itemStyle={{ color: "hsl(var(--popover-foreground))", fontSize: 12, fontWeight: 600 }}
              cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
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
