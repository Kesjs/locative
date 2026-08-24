"use client";

import { PlusIcon } from "lucide-react";
import {
  LiquidButton,
  type LiquidButtonProps,
} from "@/components/ui/liquid-button";

interface LiquidButtonDemoProps {
  variant?: LiquidButtonProps["variant"];
  size?: LiquidButtonProps["size"];
}

export default function LiquidButtonDemo({
  variant = "primary",
  size = "default",
}: LiquidButtonDemoProps) {
  return (
    <LiquidButton variant={variant} size={size}>
      {size === "icon" ? <PlusIcon style={{ width: 18, height: 18 }} /> : "Hover me"}
    </LiquidButton>
  );
}
