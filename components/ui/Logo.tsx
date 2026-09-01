"use client";

import React from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  href?: string;
}

export default function Logo({
  variant = "dark",
  size = "md",
  showText = true,
  className = "",
  href = "/",
}: LogoProps) {
  const isLight = variant === "light";

  const sizeConfig = {
    sm: { iconSize: 18, markClass: "h-7 w-7", textClass: "text-[18px]", subClass: "text-[9px]" },
    md: { iconSize: 22, markClass: "h-9 w-9", textClass: "text-[22px]", subClass: "text-[10px]" },
    lg: { iconSize: 28, markClass: "h-11 w-11", textClass: "text-[26px]", subClass: "text-[11px]" },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  const content = (
    <div className="flex items-center gap-2.5">
      {/* Brand Icon Mark */}
      <div
        className={`flex ${currentSize.markClass} items-center justify-center rounded-lg shadow-xs transition-transform duration-200 group-hover:scale-105 ${
          isLight
            ? "bg-[#9D6B3C] text-white"
            : "bg-[#18181B] text-white"
        }`}
      >
        <Building2 size={currentSize.iconSize} className="stroke-[2.2]" />
      </div>

      {/* Brand Typographic Logotype */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-serif font-extrabold tracking-[-0.04em] transition-colors ${currentSize.textClass} ${
              isLight ? "text-white" : "text-[#18181B]"
            }`}
          >
            LOKKA<span className="text-[#9D6B3C]">.</span>
          </span>
          <span
            className={`font-sans font-bold uppercase tracking-[0.18em] ${currentSize.subClass} ${
              isLight ? "text-[#E8E3DC]/70" : "text-[#71717A]"
            }`}
          >
            Bénin
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center text-decoration-none group select-none ${className}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`inline-flex items-center select-none ${className}`}>{content}</div>;
}
