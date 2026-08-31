"use client";

import { useRef, type ReactNode } from "react";
import { useLandingMotion } from "./useLandingMotion";

export default function LandingMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useLandingMotion(rootRef);

  return (
    <div ref={rootRef} className="landing-root">
      {children}
    </div>
  );
}
