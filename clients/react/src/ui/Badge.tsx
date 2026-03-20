import React from "react";
import { statusConfig, fontSize, fontWeight } from "./theme.js";

export interface BadgeProps {
  status: string;
  variant?: "overlay" | "inline";
  size?: "sm" | "md" | "lg";
}

export function Badge({ status, variant = "overlay", size = "sm" }: BadgeProps) {
  const config = statusConfig[status] ?? { label: status, color: "rgba(255, 255, 255, 0.5)" };
  const isOverlay = variant === "overlay";
  
  const sizeStyles = {
    sm: { fontSize: fontSize.xs - 1, padding: "2px 8px" },
    md: { fontSize: fontSize.sm, padding: "4px 12px" },
    lg: { fontSize: fontSize.md, padding: "6px 16px" },
  };

  return (
    <span style={{
      ...sizeStyles[size],
      fontWeight: fontWeight.semibold,
      color: "#fff",
      borderRadius: 999,
      background: config.color.startsWith("#") ? config.color : "rgba(255, 255, 255, 0.2)",
      ...(isOverlay ? { boxShadow: `0 0 0 1px rgba(0,0,0,0.1)` } : {}),
    }}>
      {config.label}
    </span>
  );
}
