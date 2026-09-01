import React from "react";
import { motion } from "framer-motion";

interface RecoveryGaugeProps {
  percentage: number;
  label?: string;
  animate?: boolean;
}

export function RecoveryGauge({ percentage, label = "Taux de Recouvrement", animate = true }: RecoveryGaugeProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = "hsl(var(--success))"; // Emerald
  if (percentage < 50) strokeColor = "hsl(var(--destructive))"; // Rose
  else if (percentage <= 80) strokeColor = "hsl(var(--warning))"; // Amber

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[120px] h-[120px]">
        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="hsl(var(--border))"
            strokeWidth="10"
          />
          {/* Progress Ring */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[24px] font-extrabold text-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <div className="mt-2 text-[10.5px] text-muted-foreground uppercase tracking-wider font-bold">
        {label}
      </div>
    </div>
  );
}
