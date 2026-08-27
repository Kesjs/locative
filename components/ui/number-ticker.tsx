"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in seconds
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  formatFn?: (val: number) => string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  formatFn,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          const num = Number(latest.toFixed(decimalPlaces));
          if (formatFn) {
            ref.current.textContent = `${prefix}${formatFn(num)}${suffix}`;
          } else {
            ref.current.textContent = `${prefix}${Intl.NumberFormat("fr-FR", {
              minimumFractionDigits: decimalPlaces,
              maximumFractionDigits: decimalPlaces,
            }).format(num)}${suffix}`;
          }
        }
      }),
    [springValue, decimalPlaces, prefix, suffix, formatFn]
  );

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-inherit tracking-tight",
        className
      )}
      ref={ref}
    >
      {prefix}
      {formatFn
        ? formatFn(direction === "down" ? value : 0)
        : Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(direction === "down" ? value : 0)}
      {suffix}
    </span>
  );
}
