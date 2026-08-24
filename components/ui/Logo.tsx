"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({
  variant = "dark",
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const iconSizes = {
    sm: { box: 28, svg: 16 },
    md: { box: 36, svg: 20 },
    lg: { box: 44, svg: 26 },
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const currentSize = iconSizes[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 text-decoration-none group ${className}`}
    >
      {/* Monogram Symbol on Dark Background */}
      <div
        className="flex items-center justify-center rounded-[8px] transition-transform duration-200 group-hover:scale-105"
        style={{
          width: currentSize.box,
          height: currentSize.box,
          backgroundColor: "#1C1C1C",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <svg
          width={currentSize.svg}
          height={currentSize.svg}
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Official Lokka Monogram - Crisp geometric stroke */}
          <path
            d="M195 87.5 L277 87.5 L231 237.5 L369 237.5 L323 372.5 L141.5 372.5 L180 252.5 L276.5 252.5 L230.5 317.5 L197.5 317.5 L217 252.5 M195 87.5"
            stroke="#FFFFFF"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <span
          className={`font-serif tracking-tight ${textSizes[size]}`}
          style={{
            fontFamily: "'Instrument Serif', 'Georgia', serif",
            color: variant === "dark" ? "#1C1C1C" : "#FFFFFF",
            fontWeight: 400,
          }}
        >
          Lokka.
        </span>
      )}
    </Link>
  );
}
