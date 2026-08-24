"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LiquidButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children?: React.ReactNode;
  className?: string;
  liquidColor?: string;
  baseColor?: string;
  textColor?: string;
  textHoverColor?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "default" | "sm" | "lg" | "icon";
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  (
    {
      children,
      className,
      liquidColor = "#0B0F19",
      baseColor = "#FFFFFF",
      textColor = "#0B0F19",
      textHoverColor = "#FFFFFF",
      variant = "primary",
      size = "default",
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [coords, setCoords] = React.useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setCoords({ x, y });
    };

    return (
      <motion.button
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        whileTap={{ scale: 0.96 }}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: size === "lg" ? "14px 28px" : size === "sm" ? "8px 16px" : "11px 22px",
          borderRadius: 8,
          border: "none",
          background: baseColor,
          color: isHovered ? textHoverColor : textColor,
          fontWeight: 600,
          fontSize: size === "lg" ? 16 : size === "sm" ? 13 : 14,
          fontFamily: "var(--font-sans)",
          cursor: "pointer",
          overflow: "hidden",
          outline: "none",
          transition: "color 0.25s ease, box-shadow 0.25s ease",
          boxShadow: isHovered
            ? "0 8px 24px rgba(255, 255, 255, 0.25)"
            : "0 4px 14px rgba(0, 0, 0, 0.1)",
          ...style,
        }}
        className={cn("liquid-button-wrapper", className)}
        {...props}
      >
        {/* Cursor-tracked Liquid Expansion Layer */}
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isHovered ? 4 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 22,
            mass: 0.6,
          }}
          style={{
            position: "absolute",
            top: `${coords.y}%`,
            left: `${coords.x}%`,
            width: 120,
            height: 120,
            marginTop: -60,
            marginLeft: -60,
            borderRadius: "50%",
            background: liquidColor,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Content Layer (stays on top) */}
        <span
          style={{
            position: "relative",
            zIndex: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "color 0.25s ease",
          }}
        >
          {children}
        </span>
      </motion.button>
    );
  }
);

LiquidButton.displayName = "LiquidButton";
