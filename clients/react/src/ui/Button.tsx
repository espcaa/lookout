import React from "react";
import { motion } from "motion/react";
import { colors, radii, fontWeight } from "./theme.js";
import { Spinner } from "./Spinner.js";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "danger" | "warning" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { background: colors.status.info, color: "#fff", border: "none" },
  success: { background: colors.status.success, color: "#fff", border: "none" },
  danger: { background: colors.status.danger, color: "#fff", border: "none" },
  warning: { background: colors.status.warning, color: "#000", border: "none" },
  secondary: { background: "transparent", color: colors.text.secondary, border: `1px solid ${colors.border.hover}` },
  ghost: { background: "transparent", color: colors.text.secondary, border: "none" },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: 12 },
  md: { padding: "8px 16px", fontSize: 13 },
  lg: { padding: "12px 24px", fontSize: 15 },
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <motion.button
      whileTap={isDisabled ? undefined : "active"}
      initial="idle"
      variants={{
        idle: { scale: 1 },
        active: { scale: 0.96 }
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={isDisabled}
      style={{
        fontWeight: fontWeight.semibold,
        borderRadius: radii.md,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: fullWidth ? "100%" : undefined,
        transition: "opacity 0.15s, background 0.15s, border-color 0.15s",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...(rest as any)}
    >
      <motion.span
        variants={{
          idle: { scale: 1 },
          active: { scale: 1 / 0.96 }
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%"
        }}
      >
        {loading && <Spinner size="sm" color={variant === "warning" ? "#000" : "#fff"} />}
        {children}
      </motion.span>
    </motion.button>
  );
}
