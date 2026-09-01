"use client";

import React, { useEffect, useRef, useState } from "react";

export interface FluidFlowGridProps {
  className?: string;
  children?: React.ReactNode;
  lineBaseColor?: string; // e.g. "15, 23, 42" (anthracite)
  accentColor?: string; // e.g. "8, 127, 91" (émeraude)
  backgroundColor?: string;
  transparent?: boolean;
  spacing?: number;
  interactiveRadius?: number;
}

export default function FluidFlowGrid({
  className = "",
  children,
  lineBaseColor = "30, 41, 59",
  accentColor = "8, 127, 91",
  backgroundColor,
  transparent = true,
  spacing = 32,
  interactiveRadius = 260,
}: FluidFlowGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = containerRef.current || canvas.parentElement;
      width = parent && parent.clientWidth > 0 ? parent.clientWidth : window.innerWidth;
      height = parent && parent.clientHeight > 0 ? parent.clientHeight : window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.009;

      // Mouse smooth interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      const activeLine = isDarkMode ? "148, 163, 184" : lineBaseColor;
      const activeAccent = isDarkMode ? "52, 211, 153" : accentColor;

      ctx.clearRect(0, 0, width, height);

      const gridSpacing = spacing;
      const cols = Math.ceil(width / gridSpacing) + 2;
      const rows = Math.ceil(height / gridSpacing) + 2;

      ctx.lineWidth = 1.35;
      ctx.lineCap = "round";

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSpacing;
          const y = j * gridSpacing;

          // Smooth fluid turbulence wave
          let angle = Math.sin(x * 0.004 + time) + Math.cos(y * 0.004 + time);

          // Force field interaction with cursor
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let isNear = false;
          if (dist < interactiveRadius && dist > 0) {
            isNear = true;
            const pushAngle = Math.atan2(dy, dx) + Math.PI;
            const force = 1 - dist / interactiveRadius;
            angle = angle * (1 - force) + pushAngle * force;
          }

          const lineLen = isNear ? 22 : 14;
          const x2 = x + Math.cos(angle) * lineLen;
          const y2 = y + Math.sin(angle) * lineLen;

          const alpha = isNear
            ? 0.85
            : 0.16 + Math.sin(x * 0.01 + y * 0.01 + time) * 0.09;

          ctx.strokeStyle = isNear
            ? `rgba(${activeAccent}, ${alpha})`
            : `rgba(${activeLine}, ${alpha})`;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDarkMode, lineBaseColor, accentColor, spacing, interactiveRadius]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block h-full w-full z-0 select-none"
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
