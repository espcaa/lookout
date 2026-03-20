export const colors = {
  bg: { body: "transparent", surface: "rgba(255, 255, 255, 0.05)", sunken: "rgba(255, 255, 255, 0.02)" },
  text: { primary: "#fff", secondary: "rgba(255, 255, 255, 0.6)", tertiary: "rgba(255, 255, 255, 0.4)", quaternary: "rgba(255, 255, 255, 0.2)", error: "#fca5a5" },
  border: { default: "rgba(255, 255, 255, 0.1)", hover: "rgba(255, 255, 255, 0.2)" },
  status: {
    success: "#22c55e",
    info: "#3b82f6",
    warning: "#f59e0b",
    danger: "#ef4444",
    neutral: "rgba(255, 255, 255, 0.5)",
  },
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
export const radii = { sm: 6, md: 8, lg: 10 } as const;
export const fontSize = { xs: 11, sm: 12, md: 13, lg: 14, xl: 16, xxl: 18, heading: 20, display: 24, timer: 32 } as const;
export const fontWeight = { normal: 400, medium: 500, semibold: 600, bold: 700 } as const;

// Unified status config - replaces duplicates in SessionCard and SessionDetail
export const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: colors.status.neutral },
  active: { label: "Recording", color: colors.status.success },
  paused: { label: "Paused", color: colors.status.warning },
  stopped: { label: "Processing", color: colors.status.info },
  compiling: { label: "Compiling", color: colors.status.info },
  complete: { label: "Complete", color: colors.status.success },
  failed: { label: "Failed", color: colors.status.danger },
};
