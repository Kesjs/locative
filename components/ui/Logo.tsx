"use client";

import React from "react";
import Link from "next/link";

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
  const heights = { sm: 28, md: 36, lg: 48 };
  const h = heights[size] || 36;

  const content = showText ? (
    <div className="flex items-center gap-2">
      <img
        src="/logo-lokka.png"
        alt="Lokka Bénin"
        style={{ height: `${h}px`, width: "auto", objectFit: "contain" }}
        className="transition-transform duration-200 group-hover:scale-105 select-none mix-blend-multiply dark:mix-blend-screen"
      />
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <img
        src="/logo.png"
        alt="Lokka"
        style={{ height: `${h}px`, width: `${h}px`, objectFit: "contain" }}
        className="rounded-lg transition-transform duration-200 group-hover:scale-105 select-none shadow-xs mix-blend-multiply dark:mix-blend-screen"
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center text-decoration-none group ${className}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`inline-flex items-center ${className}`}>{content}</div>;
}
