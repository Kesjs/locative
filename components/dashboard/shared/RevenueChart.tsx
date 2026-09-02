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
    "#059669", // Lokka Primary (Émeraude Dense)
    "#10B981", // Lokka Secondary (Émeraude Claire)
    "#34D399", // Lokka Accent
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
                  <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.35} />
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
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: 12,
                padding: "8px 12px",
                boxShadow: "var(--shadow-modal)",
                color: "hsl(var(--card-foreground))",
              }}
              labelStyle={{ color: "hsl(var(--card-foreground))", fontSize: 11, fontWeight: 700, marginBottom: 4 }}
              itemStyle={{ color: "hsl(var(--card-foreground))", fontSize: 12, fontWeight: 600 }}
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
              tickFormatter={(val) => {
                if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                if (val >= 1000) return `${Math.round(val / 1000)}k`;
                return `${val}`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: 12,
                padding: "8px 12px",
                boxShadow: "var(--shadow-modal)",
                color: "hsl(var(--card-foreground))",
              }}
              labelStyle={{ color: "hsl(var(--card-foreground))", fontSize: 11, fontWeight: 700, marginBottom: 4 }}
              itemStyle={{ color: "hsl(var(--card-foreground))", fontSize: 12, fontWeight: 600 }}
              cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
              formatter={(val: any, name: any) => [formatter(val), name]}
            />
            {dataKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={colors[i % colors.length]}
                radius={[6, 6, 0, 0]}
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
